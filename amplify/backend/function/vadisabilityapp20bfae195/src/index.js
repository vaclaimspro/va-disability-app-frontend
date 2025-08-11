/* Amplify Lambda: Create Stripe Billing Portal Link */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    console.log("Event:", event);

    const body = event.body ? JSON.parse(event.body) : {};
    const { customerId, returnUrl } = body;

    if (!customerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing customerId' }),
      };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || 'https://yourdomain.com/account',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
