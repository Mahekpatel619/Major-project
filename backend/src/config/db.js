const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Try configured URI if not dummy cluster0
  if (uri && !uri.includes('cluster0.mongodb.net') && !uri.includes('your_mongodb')) {
    try {
      console.log('Connecting to configured MongoDB URI...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.warn(`Could not connect to configured MONGO_URI (${err.message}).`);
    }
  }

  // Seamless in-memory MongoDB Server for zero-friction local development & evaluation
  try {
    console.log('Starting in-memory MongoDB server for local development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create({
      spawnTimeoutMS: 60000,
    });
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
  } catch (memoryErr) {
    console.error('Fatal: Failed to start in-memory MongoDB server:', memoryErr.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
