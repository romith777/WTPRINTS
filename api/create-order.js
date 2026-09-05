import Razorpay from 'razorpay';

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
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
      key_secret: process.env.RAZORPAY_SECRET_KEY || 'dummy_secret'
    });

    // Amount sent from frontend already includes tax and shipping and is in paise/cents.
    const options = {
      amount: Math.round(amount),
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    
    // Pass back the Key ID to the client
    res.status(200).json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Razorpay Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
}
