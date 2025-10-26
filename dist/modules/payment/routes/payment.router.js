"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_service_1 = require("../services/stripe.service");
const body_parser_1 = __importDefault(require("body-parser"));
const router = (0, express_1.Router)();
router.post('/create-checkout-session', async (req, res, next) => {
    try {
        const { plan_id, user_id } = req.body;
        if (!plan_id || !user_id)
            return res.status(400).json({ error: 'plan_id and user_id required' });
        const { url, session } = await (0, stripe_service_1.createCheckoutSession)(plan_id, user_id);
        return res.json({ checkout_url: url, session_id: session.id });
    }
    catch (err) {
        next(err);
    }
});
// Raw body needed for stripe signature verification
router.post('/stripe-webhook', body_parser_1.default.raw({ type: 'application/json' }), async (req, res) => {
    console.log("req.body: ", req.body);
    console.log("req.headers: ", req.headers);
    const sig = req.headers['stripe-signature'];
    try {
        await (0, stripe_service_1.handleWebhook)(req.body, sig);
        res.status(200).send('ok');
    }
    catch (err) {
        console.error('Webhook error', err.message || err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
exports.default = router;
