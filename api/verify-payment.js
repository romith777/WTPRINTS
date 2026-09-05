import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_SECRET_KEY || 'dummy_secret';
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Fallback for dev mode without a real secret
    if (secret === 'dummy_secret') {
        return res.status(200).json({ status: "ok", message: "Mock verification successful" });
    }

    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    
    if (isValidSignature) {
      return res.status(200).json({ status: "ok" });
    } else {
      return res.status(400).json({ status: "fail", message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Razorpay Verify Error:", err);
    res.status(500).json({ error: err.message });
  }
}
