/* Amplify Params - DO NOT EDIT
	API_VAPP1_GRAPHQLAPIENDPOINTOUTPUT
	API_VAPP1_GRAPHQLAPIIDOUTPUT
	API_VAPP1_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const stripe = require('stripe'); // Import Stripe SDK

// Initialize SSM for fetching parameters
const ssm = new AWS.SSM();

// Use a global variable to store the Stripe instance after fetching the key
let stripeInstance = null;

// Function to get Stripe Secret Key from Parameter Store
async function getStripeSecretKey() {
    if (stripeInstance) {
        return stripeInstance;
    }

    try {
        const parameterName = process.env.STRIPE_SECRET_KEY_SSM_NAME; // Read from Lambda Environment Variable
        if (!parameterName) {
            throw new Error('STRIPE_SECRET_KEY_SSM_NAME environment variable not set.');
        }

        const data = await ssm.getParameter({
            Name: parameterName,
            WithDecryption: true
        }).promise();

        const secretKey = data.Parameter.Value;
        stripeInstance = stripe(secretKey); // Initialize Stripe with the secret key
        return stripeInstance;
    } catch (error) {
        console.error('Failed to retrieve Stripe secret key from SSM:', error);
        throw new Error('Internal Server Error: Could not retrieve Stripe configuration.');
    }
}

// Handler function for Lambda
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const headers = {
        "Access-Control-Allow-Origin": "*", // IMPORTANT: Enable CORS for frontend access
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET" // Allow methods needed
    };

    // Handle CORS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify('OK')
        };
    }

    try {
        const stripeClient = await getStripeSecretKey(); // Get the Stripe client instance

        // Assuming your API Gateway paths are /stripe/create-checkout-session and /stripe/create-billing-portal-link
        const path = event.path;
        const httpMethod = event.httpMethod;

        if (httpMethod === 'POST' && path.endsWith('/create-checkout-session')) {
            const { userId, priceId, successUrl, cancelUrl } = JSON.parse(event.body);

            // Fetch user's email to pass to Stripe checkout if it's not the userId
            const docClient = new AWS.DynamoDB.DocumentClient();
            const userProfileTable = process.env.USER_PROFILE_TABLE_NAME;
            
            if (!userProfileTable) {
                 throw new Error('USER_PROFILE_TABLE_NAME environment variable not set.');
            }

            const userProfileData = await docClient.get({
                TableName: userProfileTable,
                Key: { id: userId }
            }).promise();

            const userEmail = userProfileData.Item?.email;

            const session = await stripeClient.checkout.sessions.create({
                customer_email: userEmail, // Use the user's actual email
                client_reference_id: userId, // Link to your internal user ID
                line_items: [
                    {
                        price: priceId, // Stripe Price ID (e.g., 'price_12345')
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: successUrl,
                cancel_url: cancelUrl,
                // Add metadata for tracking in Stripe
                metadata: {
                    userId: userId,
                    type: 'subscription'
                },
            });

            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ url: session.url }),
            };

        } else if (httpMethod === 'POST' && path.endsWith('/create-billing-portal-link')) {
            const { userId } = JSON.parse(event.body);

            // You need to retrieve the Stripe Customer ID for this userId from your database (DynamoDB UserProfile)
            const docClient = new AWS.DynamoDB.DocumentClient();
            const userProfileTable = process.env.USER_PROFILE_TABLE_NAME;
            
            if (!userProfileTable) {
                 throw new Error('USER_PROFILE_TABLE_NAME environment variable not set.');
            }

            const userProfileData = await docClient.get({
                TableName: userProfileTable,
                Key: { id: userId }
            }).promise();

            const customerId = userProfileData.Item?.stripeCustomerId;

            if (!customerId) {
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Stripe customer ID not found for this user. Please ensure the user has completed a purchase previously.' }),
                };
            }

            const session = await stripeClient.billingPortal.sessions.create({
                customer: customerId,
                return_url: event.headers.origin, // Return to app's origin
            });

            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ url: session.url }),
            };

        } else if (httpMethod === 'GET' && path.endsWith('/customer-status')) {
            // This is for the `checkStripeCustomerStatus` function in App.jsx
            const userId = event.queryStringParameters?.userId;
            if (!userId) {
                return {
                    statusCode: 400,
                    headers: headers,
                    body: JSON.stringify({ error: 'Missing userId parameter.' }),
                };
            }

            const docClient = new AWS.DynamoDB.DocumentClient();
            const userProfileTable = process.env.USER_PROFILE_TABLE_NAME;

             if (!userProfileTable) {
                 throw new Error('USER_PROFILE_TABLE_NAME environment variable not set.');
            }

            const userProfileData = await docClient.get({
                TableName: userProfileTable,
                Key: { id: userId }
            }).promise();

            const stripeId = userProfileData.Item?.stripeCustomerId;
            
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ stripeId: stripeId || null }),
            };

        } else {
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify('Not Found: Invalid API path or method.'),
            };
        }
    } catch (error) {
        console.error('Lambda execution error:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
};