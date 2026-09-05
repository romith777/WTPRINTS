const fs = require('fs');

// 1. Create api/sync-user-data.js
const syncApiCode = `import { MongoClient, ObjectId } from 'mongodb';
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

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-dev');
    
    const { cart, favorites } = req.body;
    
    const client = await connectToDatabase();
    const db = client.db('wtprints');
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { cart: cart || [], favorites: favorites || [] } }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Sync Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
`;
fs.writeFileSync('api/sync-user-data.js', syncApiCode, 'utf8');

// 2. Update api/login.js to return cart and favorites
let loginApi = fs.readFileSync('api/login.js', 'utf8');
loginApi = loginApi.replace(
  /user: \{ username: user\.username, email: user\.email \}/,
  'user: { username: user.username, email: user.email, cart: user.cart || [], favorites: user.favorites || [] }'
);
fs.writeFileSync('api/login.js', loginApi, 'utf8');
