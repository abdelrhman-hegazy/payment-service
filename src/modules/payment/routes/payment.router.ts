import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../services/stripe.service';
import bodyParser from 'body-parser';

const router = Router();

router.post('/create-checkout-session', async (req, res, next) => {
  try {
    const { plan_id, user_id } = req.body;
    if (!plan_id || !user_id) return res.status(400).json({ error: 'plan_id and user_id required' });

    const { url, session } = await createCheckoutSession(plan_id, user_id);
    return res.json({ checkout_url: url, session_id: session.id });
  } catch (err: any) {
    next(err);
  }
});

// Raw body needed for stripe signature verification
router.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req: any, res) => {
  console.log("req.body: ", req.body);
  console.log("req.headers: ", req.headers);
  
  
  const sig = req.headers['stripe-signature'];
  try {
    await handleWebhook(req.body, sig);
    res.status(200).send('ok');
  } catch (err: any) {
    console.error('Webhook error', err.message || err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}); 

export default router;
