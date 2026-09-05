import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, cart, shippingDetails } = req.body;
    let userId = null;
    let userEmail = shippingDetails?.email || 'guest';

    // Check authorization token to link to user account
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
          userId = decoded.userId;
        } catch (e) {
          console.log("Invalid token, treating as guest order");
        }
      }
    }

    const client = await connectToDatabase();
    const db = client.db('wtprints');

    const newOrder = {
      userId,
      userEmail,
      shippingDetails,
      cart,
      amount,
      status: 'Processing', // 'Processing', 'Shipped to Hub', 'Consolidating', 'Shipped', 'Delivered'
      paymentStatus: 'Paid', // Mocked as paid
      createdAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(newOrder);

    return res.status(200).json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
