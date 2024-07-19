const { MongoClient } = require('mongodb');

const state = {
    db: null
};

const connect = async function(done) {
    const url = 'mongodb://localhost:27017';
    const dbname = 'shopping';

    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB server
        await client.connect();
        state.db = client.db(dbname);

        // Create a collection and insert a document to ensure the database is created
        const collection = state.db.collection('testCollection');
        const result = await collection.insertOne({ test: 'This is a test document' });
        console.log('MongoDB connected successfully and test document inserted');
        done();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        done(err); // Pass error to callback
    }
};

const getDB = function() {
    return state.db;
};

module.exports = { connect, getDB };