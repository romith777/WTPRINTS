import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-dev');
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const { type, currentPassword, newPassword, newEmail } = req.body;
    
    const client = await connectToDatabase();
    const db = client.db('wtprints');
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (type === 'Password') {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect current password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await users.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } 
    
    else if (type === 'Email') {
      if (!newEmail) {
        return res.status(400).json({ success: false, message: 'Missing new email' });
      }

      // Check if email already exists
      const existingUser = await users.findOne({ email: newEmail });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }

      await users.updateOne({ _id: user._id }, { $set: { email: newEmail } });
      
      return res.status(200).json({ success: true, message: 'Email updated successfully', email: newEmail });
    } 
    
    else {
      return res.status(400).json({ success: false, message: 'Invalid update type' });
    }

  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
