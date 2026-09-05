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
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      userId = decoded.userId;
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const client = await connectToDatabase();
    const db = client.db('wtprints');

    const orders = await db.collection('orders')
                           .find({ userId })
                           .sort({ createdAt: -1 })
                           .toArray();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("My Orders Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
