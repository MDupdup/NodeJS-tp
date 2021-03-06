const app = require('express')();
const fs = require('fs');

fs.readFile('./db.json', (err, data) => {
    if(err) {
        console.error(err)
    }
    json = JSON.parse(data);
});

app.use((req, res, next) => {
    fs.appendFileSync('./logs/requests.log', `[${new Date(Date.now()).toLocaleString()}] ${req.method} request received (URI: ${req.originalUrl}).\n`)
    next()
});

app.route('/list')
    .get((req, res) => { 
        mongoDBClient.db.collection('list').find({}).toArray().then(result => {
            res.json(result) 
        }).catch(err => {
            console.error(err);
        });
    })
    .post((req, res) => {

        mongoDBClient.db.collection('list').insertOne({
            "id": req.body.id,
            "name": req.body.name,
            "userId": req.body.userId,
            "itemId": req.body.itemId
        });
     });

app.get('/:listId', (req, res) => { 
    mongoDBClient.db.collection('users').find({ "id": parseInt(req.params.listId) }).toArray().then(result => {
        res.json(result) 
    }).catch(err => {
        console.error(err);
    });
 });
app.put('/:listId', (req, res) => {
    
    mongoDBClient.db.collection('list').findOneAndReplace(
        { "id": parseInt(req.params.listId) },
        {
            "id": req.body.id,
            "name": req.body.name,
            "userId": req.body.userId,
            "itemId": req.body.itemId
        });
});
app.delete('/:listId', (req, res) => {
    
    mongoDBClient.db.collection('list').deleteOne({
        "id": parseInt(req.params.listId) 
    });
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./logs/errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\n Error: ${err.stack}\r\n`);
    next();
});

module.exports = app;