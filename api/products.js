import { MongoClient } from 'mongodb';

let cachedClient = null;

export default async function handler(req, res) {
  // Setup CORS just in case
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    // If MONGODB_URI is not set in Vercel, return a fallback object so the site doesn't completely crash for viewers.
    return res.status(200).json({
      success: true,
      products: {
        tees: [
          {
            _id: "demo-raiz-001",
            name: "raiz",
            brandName: "qq",
            about: "raiz",
            image: "https://res.cloudinary.com/dkqc99bkj/image/upload/v1787768848/fyiciqj9jw8vbz0szg38.png",
            priceCents: 99900,
            productType: "tees",
            keyword: "raiz"
          }
        ],
        hoodies: [], cargos: [], jeans: [], joggers: [], shirts: []
      }
    });
  }

  try {
    if (!cachedClient) {
      cachedClient = await MongoClient.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
    }

    const db = cachedClient.db(); 
    // Assuming the main data is in the 'products' collection based on backend code
    const collection = db.collection('products');
    
    const data = await collection.findOne({});
    
    if (data) {
      delete data._id;
      delete data.__v;
      return res.status(200).json({ success: true, products: data });
    } else {
      return res.status(200).json({ success: true, products: {} });
    }
  } catch (error) {
    console.error("Vercel DB fetch error:", error);
    return res.status(500).json({ success: false, error: "Failed to connect to database" });
  }
}
