const app = require('express')();
const fs = require('fs');
const mongoDBClient = require('../MongoConnector');

const client = mongoDBClient.init();



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
    .get((req, res) => { res.json(json.users) })
    .post((req, res) => {

       

        mongoDBClient.db.collection('users').insert({
            "id": (typeof req.body.id !== 'undefined') ? req.body.id : json.users.length + 1,
            "name": req.body.name,
            "password": req.body.password
        });


        mongoDBClient.db.collection('users').find({ "name": req.body.name }).toArray().then(result => {
            console.log(result);
        })

        let User = {
            id: (typeof req.body.id !== 'undefined') ? req.body.id : json.users.length + 1,
            name: req.body.name,
            password: req.body.password
        }
        json.users.push(User);

        fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
     });
app.get('/:userId', (req, res) => { res.json(json.users.find(x => x.id == req.params.userId)) });
app.put('/:userId', (req, res) => {
    
    let user = json.users.find(x => x.id == req.params.userId);

    list.name = req.body.name;
    list.password = req.body.password;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});
app.delete('/:userId', (req, res) => {
    
    let i = json.users.findIndex(x => x.id == req.params.userId);

    json.users.splice(i,1);

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./logs/errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\r\n`);
    next();
});

module.exports = app;