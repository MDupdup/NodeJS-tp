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
    .get((req, res) => { res.json(json.list) })
    .post((req, res) => {

        let List = {
            id: (typeof req.body.id !== 'undefined') ? req.body.id : json.list.length + 1,
            name: req.body.name,
            userId: req.body.userId,
            itemId: req.body.itemId
        }
        json.list.push(List);

        fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
     });
app.get('/:listId', (req, res) => { res.json(json.list.find(x => x.id == req.params.listId)) });
app.put('/:listId', (req, res) => {
    
    let list = json.list.find(x => x.id == req.params.listId);

    list.name = req.body.name;
    list.userId = req.body.userId;
    list.itemId = req.body.itemId;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});
app.delete('/:listId', (req, res) => {
    
    let i = json.list.findIndex(x => x.id == req.params.listId);

    json.list.splice(i,1);

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./logs/errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\n Error: ${err.stack}\r\n`);
    next();
});

module.exports = app;