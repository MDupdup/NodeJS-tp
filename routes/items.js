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

app.route('/')
    .get((req, res) => { 
        mongoDBClient.db.collection('items').find({}).toArray().then(result => {
            res.json(result) 
        }).catch(err => {
            console.error(err);
        });
     })
    .post((req, res) => {

        mongoDBClient.db.collection('items').insertOne({
            "id": req.body.id,
            "label": req.body.label,
            "image": req.body.image,
            "description": req.body.description
        });

     });

app.get('/:itemId', (req, res) => { 
    mongoDBClient.db.collection('items').find({ "id": parseInt(req.params.itemId) }).toArray().then(result => {
        res.json(result) 
    }).catch(err => {
        console.error(err);
    });
});
app.put('/:itemId', (req, res) => {
    
    mongoDBClient.db.collection('items').findOneAndReplace(
        { "id": parseInt(req.params.itemId) },
        {
            "id": req.body.id,
            "label": req.body.label,
            "image": req.body.image,
            "description": req.body.description
        });
});
app.delete('/:itemId', (req, res) => {
    
    mongoDBClient.db.collection('items').deleteOne({
        "id": parseInt(req.params.itemId) 
    });
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./logs/errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\r\n`);
    next();
});

module.exports = app;