const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET) {
  console.warn('WARNING: STRIPE_SECRET_KEY not set. Payment endpoints will use test mode.');
}

const stripe = STRIPE_SECRET ? require('stripe')(STRIPE_SECRET) : null;

const PRICES = {
  monthly: { amount: 3000, name: 'FitBody VIP 月度会员', interval: 'month', trialDays: 3 },
  yearly: { amount: 35000, name: 'FitBody VIP 年度会员', interval: 'year', trialDays: 7 },
  lifetime: { amount: 99800, name: 'FitBody VIP 永久买断', interval: null, trialDays: null },
};

app.post('/api/create-checkout', async (req, res) => {
  const { planType } = req.body;

  if (!planType || !PRICES[planType]) {
    return res.status(400).json({ error: '无效的套餐类型' });
  }

  if (!stripe) {
    return res.status(500).json({
      error: 'STRIPE_SECRET_KEY not configured',
      hint: 'Set STRIPE_SECRET_KEY environment variable and restart the server',
    });
  }

  const priceConfig = PRICES[planType];

  try {
    const lineItem = {
      price_data: {
        currency: 'cny',
        product_data: { name: priceConfig.name },
        unit_amount: priceConfig.amount,
      },
      quantity: 1,
    };

    if (priceConfig.interval) {
      lineItem.price_data.recurring = {
        interval: priceConfig.interval,
        trial_period_days: priceConfig.trialDays,
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay', 'wechat_pay'],
      line_items: [lineItem],
      mode: priceConfig.interval ? 'subscription' : 'payment',
      success_url: 'http://localhost:8081?payment=success&plan=' + planType,
      cancel_url: 'http://localhost:8081?payment=cancelled',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: '创建支付失败: ' + err.message });
  }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.sendStatus(500);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment succeeded:', session.id, session.customer_email);
    // TODO: Update user's subscription status in database
  }

  res.json({ received: true });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, stripe: !!stripe });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
  console.log(`Stripe: ${stripe ? 'CONNECTED' : 'NOT CONFIGURED (set STRIPE_SECRET_KEY)'}`);
});
