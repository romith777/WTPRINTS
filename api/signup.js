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

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
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
    const db = cachedClient.db('wtprints');
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Sign JWT
    const token = jwt.sign(
      { userId: result.insertedId, username: newUser.username },
      process.env.JWT_SECRET || 'fallback-secret-key-for-dev',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { username: newUser.username, email: newUser.email }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
