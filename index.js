
const app = require('express')();
//const list = require('./routes/list');
const fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('view engine', 'pug');
app.set('views', './views');

fs.readFile('./db.json', (err, data) => {
    if(err) {
        console.error(err)
    }
    json = JSON.parse(data);
})

app.get('/', (req, res) => { res.json(json) });



app.route('/users')
    .get((req, res) => { res.json(json.users) })
    .post((req, res) => {

        let User = {
            id: (typeof req.body.id !== 'undefined') ? req.body.id : json.users.length + 1,
            name: req.body.name,
            password: req.body.password
        }
        json.users.push(User);

        fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
     });
app.get('/users/:userId', (req, res) => { res.json(json.users.find(x => x.id == req.params.userId)) });
app.put('/users/:userId', (req, res) => {
    
    let user = json.users.find(x => x.id == req.params.userId);

    list.name = req.body.name;
    list.password = req.body.password;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});
app.delete('/list/:userId', (req, res) => {
    
    let i = json.users.findIndex(x => x.id == req.params.userId);

    json.users.splice(i,1);

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});



app.route('/items')
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
     })
app.get('/items/:itemId', (req, res) => { res.json(json.items.find(x => x.id == req.params.itemId)) });
app.put('/items/:itemId', (req, res) => {
    
    let item = json.items.find(x => x.id == req.params.itemId);

    item.label = req.body.label;
    item.image = req.body.image;
    item.description = req.body.description;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
})
app.delete('/list/:itemId', (req, res) => {
    
    let i = json.item.findIndex(x => x.id == req.params.itemId);

    json.item.splice(i,1);

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
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
app.get('/list/:listId', (req, res) => { res.json(json.list.find(x => x.id == req.params.listId)) });
app.put('/list/:listId', (req, res) => {
    
    let list = json.list.find(x => x.id == req.params.listId);

    list.name = req.body.name;
    list.userId = req.body.userId;
    list.itemId = req.body.itemId;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});
app.delete('/list/:listId', (req, res) => {
    
    let i = json.list.findIndex(x => x.id == req.params.listId);

    json.list.splice(i,1);

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});


// MiddleWare requests
app.use((req, res, next) => {
    fs.appendFileSync('./requests.log', `[${new Date(Date.now()).toLocaleString()}] ${req.method} request received (URI: ${req.originalUrl}).\n`);
    next();
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\r\n`);
    next();
});



app.listen(5000, () => {
    console.log("App listening on port 5000");
});