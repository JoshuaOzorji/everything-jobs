import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

export default clientPromise;
