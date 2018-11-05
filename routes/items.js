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
    .get((req, res) => { res.json(json.items) })
    .post((req, res) => {

        let Item = {
            id: (typeof req.body.id !== 'undefined') ? req.body.id : json.items.length + 1,
            label: req.body.label,
            image: req.body.image,
            description: req.body.description
        }
        json.items.push(Item);

        fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
     });

app.get('/:itemId', (req, res) => { res.json(json.items.find(x => x.id == req.params.itemId)) });
app.put('/:itemId', (req, res) => {
    
    let item = json.items.find(x => x.id == req.params.itemId);

    item.label = req.body.label;
    item.image = req.body.image;
    item.description = req.body.description;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});
app.delete('/:itemId', (req, res) => {
    
    let i = json.item.findIndex(x => x.id == req.params.itemId);

    json.item.splice(i,1);

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./logs/errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\r\n`);
    next();
});

module.exports = app;