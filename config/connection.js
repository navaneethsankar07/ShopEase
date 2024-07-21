const { MongoClient } = require('mongodb');
require('dotenv').config();

const state = {
    db: null
};

const connect = async function(done) {
    const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbname = process.env.DB_NAME || 'shopping';

    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();
        state.db = client.db(dbname);

        // Remove the test insert operation for production use
        console.log('MongoDB connected successfully');
        done();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        if (client) client.close(); // Ensure the client is closed on error
        done(err); // Pass error to callback
    }
};

const getDB = function() {
    return state.db;
};

module.exports = { connect, getDB };
