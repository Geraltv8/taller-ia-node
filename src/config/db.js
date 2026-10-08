import mongoose from 'mongoose';

export async function connectDB() {
  const connection = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
  console.log(`MongoDB conectado: ${connection.connection.host}/${connection.connection.name}`);
  return connection;
}
