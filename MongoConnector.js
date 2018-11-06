const MongoClient = require('mongodb').MongoClient;
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

const connector = new MongoConnector();
module.exports = connector;