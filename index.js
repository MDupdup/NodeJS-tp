
const app = require('express')();
const fs = require('fs');

const users = require('./routes/users');
const items = require('./routes/items');
const list = require('./routes/list');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.set('view engine', 'pug');
app.set('views', './views');

app.use('/users', users);
app.use('/items', items);
app.use('/list', list);

app.get('/', (req, res) => { res.json(json) });

app.listen(5000, () => {
    console.log("App listening on port 5000");
});