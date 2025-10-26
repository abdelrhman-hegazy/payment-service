"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const pool_1 = require("../../../config/db/pool");
const env_1 = require("../../../config/env");
dotenv_1.default.config();
const stripeKey = env_1.env.stripe.STRIPE_API_KEY;
const stripe = new stripe_1.default(stripeKey, { apiVersion: '2022-11-15' });
async function createCheckoutSession(planId, userId) {
    const priceMap = {
        pro: 'price_1SMFeT3zXzrMzVqlefs0CLOV',
        basic: 'price_1SMFgo3zXzrMzVqlBolbV93K',
    };
    const priceId = priceMap[planId];
    if (!priceId)
        throw new Error('Unknown plan_id');
    // Get user from DB
    const { rows } = await (0, pool_1.query)('SELECT stripe_customer_id, email FROM users WHERE id = $1', [userId]);
    let customerId = rows[0]?.stripe_customer_id;
    const email = rows[0]?.email || undefined;
    // Create new customer if not found
    if (!customerId) {
        const customer = await stripe.customers.create({
            email,
            metadata: { userId },
        });
        customerId = customer.id;
        // Store new customer ID in users table
        await (0, pool_1.query)('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [
            customerId,
            userId,
        ]);
    }
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: 'https://flowscape-pro.lovable.app/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://flowscape-pro.lovable.app/cancel',
        metadata: { userId: userId, planId: planId },
    });
    return { url: session.url, session };
}
exports.createCheckoutSession = createCheckoutSession;
async function handleWebhook(rawBody, sig) {
    console.log("rawBody: ", rawBody);
    console.log("sig: ", sig);
    const webhookSecret = env_1.env.stripe.STRIPE_WEBHOOK_SECRET;
    // const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    }
    catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        throw new Error(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
        });
        const customerId = fullSession.customer;
        const subscriptionId = fullSession.subscription;
        const planId = fullSession.metadata?.planId || 'pro';
        const userId = fullSession.metadata?.userId;
        if (customerId && subscriptionId && userId) {
            await (0, pool_1.query)(`INSERT INTO subscriptions (user_id, plan_id, stripe_subscription_id, status, stripe_price_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO UPDATE 
           SET stripe_subscription_id = EXCLUDED.stripe_subscription_id,
               status = EXCLUDED.status,
               updated_at = now()`, [userId, planId, subscriptionId, 'active', fullSession.line_items?.data[0]?.price?.id]);
            await (0, pool_1.query)('UPDATE users SET plan_status = $1 WHERE id = $2', [
                'active',
                userId,
            ]);
        }
    }
    return event;
}
exports.handleWebhook = handleWebhook;
