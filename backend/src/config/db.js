const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  dns.setDefaultResultOrder('ipv4first');

  if (env.mongodbUri.startsWith('mongodb+srv://') && env.dnsServers.length > 0) {
    dns.setServers(env.dnsServers);
  }

  const connection = await mongoose.connect(env.mongodbUri, {
    autoIndex: env.nodeEnv !== 'production',
    serverSelectionTimeoutMS: 30000
  });

  console.log(`Connected to MongoDB: ${connection.connection.host}`);
};

module.exports = connectDatabase;
