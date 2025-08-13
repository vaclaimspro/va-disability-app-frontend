/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const stripe = require('stripe');
const { DataStore } = require('aws-amplify/datastore');
const { UserProfile, UserSubscription } = require('../../../src/models');

const ssm = new AWS.SSM();

let stripeInstance = null;
let webhookSecret = null; // New global variable for webhook secret

async function getStripeClient() {
    if (stripeInstance) {
        return stripeInstance;
    }

    try {
        const parameterName = process.env.STRIPE_SECRET_KEY_SSM_NAME;
        if (!parameterName) {
            throw new Error('STRIPE_SECRET_KEY_SSM_NAME environment variable not set.');
        }

        const data = await ssm.getParameter({
            Name: parameterName,
            WithDecryption: true
        }).promise();

        const secretKey = data.Parameter.Value;
        stripeInstance = stripe(secretKey);
        return stripeInstance;
    } catch (error) {
        console.error('Failed to retrieve Stripe secret key from SSM:', error);
        throw new Error('Internal Server Error: Could not retrieve Stripe configuration.');
    }
}

async function getWebhookSecret() {
    if (webhookSecret) {
        return webhookSecret;
    }
    // You must store your webhook secret in SSM Parameter Store
    // and retrieve it similarly to the Stripe Secret Key
    try {
        const parameterName = process.env.STRIPE_WEBHOOK_SECRET_SSM_NAME;
        if (!parameterName) {
            throw new Error('STRIPE_WEBHOOK_SECRET_SSM_NAME environment variable not set.');
        }
        const data = await ssm.getParameter({
            Name: parameterName,
            WithDecryption: true
        }).promise();
        webhookSecret = data.Parameter.Value;
        return webhookSecret;
    } catch (error) {
        console.error('Failed to retrieve Stripe webhook secret from SSM:', error);
        throw new Error('Internal Server Error: Could not retrieve Stripe webhook configuration.');
    }
}


exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify('OK') };
    }

    const docClient = new AWS.DynamoDB.DocumentClient();
    const userProfileTable = process.env.USER_PROFILE_TABLE_NAME;

    try {
        const stripeClient = await getStripeClient();
        const path = event.path;
        const httpMethod = event.httpMethod;

        if (httpMethod === 'POST' && path.endsWith('/create-checkout-session')) {
            const { userId, priceId, successUrl, cancelUrl } = JSON.parse(event.body);
            const userProfileData = await docClient.get({ TableName: userProfileTable, Key: { id: userId } }).promise();
            const userEmail = userProfileData.Item?.email;

            const session = await stripeClient.checkout.sessions.create({
                customer_email: userEmail,
                client_reference_id: userId,
                line_items: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: { userId: userId, type: 'subscription' },
            });

            return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };

        } else if (httpMethod === 'POST' && path.endsWith('/create-billing-portal-link')) {
            const { userId } = JSON.parse(event.body);
            const userProfileData = await docClient.get({ TableName: userProfileTable, Key: { id: userId } }).promise();
            const customerId = userProfileData.Item?.stripeCustomerId;

            if (!customerId) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Stripe customer ID not found for this user.' }) };
            }

            const session = await stripeClient.billingPortal.sessions.create({
                customer: customerId,
                return_url: event.headers.origin,
            });

            return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };

        } else if (httpMethod === 'GET' && path.endsWith('/customer-status')) {
            const userId = event.queryStringParameters?.userId;
            if (!userId) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing userId parameter.' }) };
            }
            const userProfileData = await docClient.get({ TableName: userProfileTable, Key: { id: userId } }).promise();
            const stripeId = userProfileData.Item?.stripeCustomerId;
            return { statusCode: 200, headers, body: JSON.stringify({ stripeId: stripeId || null }) };

        } else if (httpMethod === 'POST' && path.endsWith('/webhook')) { // NEW WEBHOOK HANDLER
            const webhookSecret = await getWebhookSecret();
            const sig = event.headers['stripe-signature'];
            
            let stripeEvent;
            try {
                stripeEvent = stripeClient.webhooks.constructEvent(event.body, sig, webhookSecret);
            } catch (err) {
                console.error(`Webhook signature verification failed: ${err.message}`);
                return { statusCode: 400, headers, body: JSON.stringify({ error: `Webhook Error: Invalid signature` }) };
            }

            const { UserProfile, UserSubscription } = require('../../../src/models');
            
            switch (stripeEvent.type) {
                case 'checkout.session.completed':
                    const checkoutSession = stripeEvent.data.object;
                    const userId = checkoutSession.client_reference_id;
                    const customerId = checkoutSession.customer;
                    const subscriptionId = checkoutSession.subscription;

                    const profiles = await DataStore.query(UserProfile, (p) => p.owner.eq(userId));
                    if (profiles.length > 0) {
                        const profile = profiles[0];
                        await DataStore.save(UserProfile.copyOf(profile, updated => {
                            updated.membershipStatus = 'Pro';
                            updated.stripeCustomerId = customerId;
                            updated.stripeSubscriptionId = subscriptionId;
                        }));
                    }
                    break;
                case 'customer.subscription.updated':
                    const subscription = stripeEvent.data.object;
                    const updatedUserId = subscription.client_reference_id;
                    const status = subscription.status;

                    const userProfiles = await DataStore.query(UserProfile, (p) => p.owner.eq(updatedUserId));
                    if (userProfiles.length > 0) {
                        const profile = userProfiles[0];
                        await DataStore.save(UserProfile.copyOf(profile, updated => {
                            updated.membershipStatus = status === 'active' ? 'Pro' : 'Free';
                            updated.stripeSubscriptionId = subscription.id;
                        }));
                    }
                    break;
            }

            return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
        } else {
            return { statusCode: 404, headers, body: JSON.stringify('Not Found: Invalid API path or method.') };
        }
    } catch (error) {
        console.error('Lambda execution error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error', details: error.message }) };
    }
};
