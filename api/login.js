import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let cachedClient = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res.status(500).json({ success: false, message: 'Database URI not configured' });
  }

  try {
    if (!cachedClient) {
      cachedClient = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }
    const db = cachedClient.db();
    const usersCollection = db.collection('users');

    // Find user (allow logging in by email or username)
    const user = await usersCollection.findOne({ 
      $or: [{ email: username }, { username: username }] 
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key-for-dev',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { username: user.username, email: user.email }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
