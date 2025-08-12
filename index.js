/**
 * Firebase Cloud Functions (Node 20, v2 APIs)
 * - syncSubscriptionCreate / syncSubscriptionUpdate:
 *     Watches Stripe Extension docs at customers/{uid}/subscriptions/{subId}
 *     and mirrors status -> users/{uid}.membership.status ("Pro" | "Free")
 * - createBillingPortalLink (callable):
 *     Returns a Stripe Billing Portal URL for the signed-in user
 * - manuallyUpgradeToPro (callable):
 *     Emergency switch to set users/{uid}.membership.status = "Pro"
 *
 * Assumptions:
 * - You installed the Stripe Firebase Extension
 * - Your frontend creates checkout sessions by writing to:
 *     customers/{uid}/checkout_sessions/{autoId}
 * - You set the Stripe secret:
 *     firebase functions:config:set stripe.secret="sk_test_or_live_***"
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { logger, params } = require('firebase-functions');
const Stripe = require('stripe');

// --- Admin init ---
initializeApp();
const db = getFirestore();

// --- Stripe init (for billing portal) ---
/**
 * Reads secret from functions config:
 *   firebase functions:config:set stripe.secret="sk_test_..."
 */
const STRIPE_SECRET = params.stripe?.secret || process.env.STRIPE_SECRET || null;
const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET, { apiVersion: '2024-06-20' }) : null;

// Utility to map Stripe subscription status -> app membership label
const asMembership = (stripeStatus) =>
  ['active', 'trialing'].includes(stripeStatus) ? 'Pro' : 'Free';

// ----------------------------------------------------------------------------
// 1) Mirror subscription status to users/{uid}.membership.status
// ----------------------------------------------------------------------------

// Fires when the extension creates a subscription doc
exports.syncSubscriptionCreate = onDocumentCreated(
  'customers/{uid}/subscriptions/{subId}',
  async (event) => {
    try {
      const { uid, subId } = event.params;
      const sub = event.data.data(); // { status, items, ... }
      const membership = asMembership(sub?.status);

      await db.collection('users').doc(uid).set(
        { membership: { status: membership, stripeSubId: subId } },
        { merge: true }
      );

      logger.info(`[syncSubscriptionCreate] uid=${uid} subId=${subId} -> ${membership}`);
    } catch (err) {
      logger.error('[syncSubscriptionCreate] failed', err);
      throw err;
    }
  }
);

// Fires whenever the subscription doc changes (cancel, past_due, reactivated, etc.)
exports.syncSubscriptionUpdate = onDocumentUpdated(
  'customers/{uid}/subscriptions/{subId}',
  async (event) => {
    try {
      const { uid } = event.params;
      const before = event.data.before.data();
      const after = event.data.after.data();

      if (before?.status === after?.status) return;

      const membership = asMembership(after?.status);
      await db.collection('users').doc(uid).set(
        { membership: { status: membership } },
        { merge: true }
      );

      logger.info(
        `[syncSubscriptionUpdate] uid=${uid} ${before?.status} -> ${after?.status} => ${membership}`
      );
    } catch (err) {
      logger.error('[syncSubscriptionUpdate] failed', err);
      throw err;
    }
  }
);

// ----------------------------------------------------------------------------
/**
 * 2) Billing Portal (callable)
 *    Returns a Stripe Billing Portal URL for the signed-in user.
 *    Frontend:
 *      const portal = httpsCallable(getFunctions(), 'createBillingPortalLink');
 *      const { data } = await portal();
 *      window.location.assign(data.url);
 */
// ----------------------------------------------------------------------------
exports.createBillingPortalLink = onCall(async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  if (!stripe) {
    logger.error('Stripe secret not configured.');
    throw new HttpsError(
      'failed-precondition',
      'Stripe is not configured. Contact support.'
    );
  }

  const uid = req.auth.uid;

  // The Stripe extension stores the Stripe customer ID on customers/{uid}
  const customerSnap = await db.collection('customers').doc(uid).get();
  const stripeId = customerSnap.data()?.stripeId;

  if (!stripeId) {
    throw new HttpsError(
      'failed-precondition',
      'No Stripe customer found for this user.'
    );
  }

  // Try to infer return URL from the callable request
  const origin =
    (req.rawRequest && req.rawRequest.headers && req.rawRequest.headers.origin) ||
    'https://yourdomain.com';

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: `${origin}/membership`,
  });

  return { url: session.url };
});

// ----------------------------------------------------------------------------
/**
 * 3) Manual Upgrade (callable) — optional failsafe
 *    Not used in normal flow; Stripe webhooks + triggers handle status.
 */
// ----------------------------------------------------------------------------
exports.manuallyUpgradeToPro = onCall(async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  const uid = req.auth.uid;

  await db.collection('users').doc(uid).set(
    { membership: { status: 'Pro', manuallySetAt: new Date().toISOString() } },
    { merge: true }
  );

  logger.warn(`[manuallyUpgradeToPro] uid=${uid} forced to Pro`);
  return { success: true, status: 'Pro' };
});
