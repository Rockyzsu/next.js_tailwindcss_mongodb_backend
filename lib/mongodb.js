const { MongoClient } = require('mongodb');

if (!process.env.MONGODB_URI) {
  throw new Error('请配置 .env 文件中的 MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

module.exports = clientPromise;
