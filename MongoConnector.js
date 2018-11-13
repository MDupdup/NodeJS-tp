const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
//const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true });
const dbName = 'db';

class MongoConnector {

    init() {
        return new Promise((resolve, reject) => {
            client.connect()
                .then(connectedClient => {
                    this.client = connectedClient;
                    this.db = connectedClient.db(dbName);
                    console.log("Connected successfully to server");
                    resolve(connectedClient);
                })
                .catch(err => {
                    console.error("Failed to connect to server");
                    throw err;
                })
        });
    }
}

class MongooseConnector {
    init() {
        return new Promise((resole, reject) => {
            mongoose.connect(url + "/" + dbName, { useNewUrlParser: true });
            const db = mongoose.connection;

            db.on('error', error => {
                console.error('connection error:', error);
            })
            db.once('open', () => {
                console.log('Connected successfully to server.');
            })
        })
    }
}

//const connector = new MongoConnector();

const connector = new MongooseConnector();
module.exports = connector;