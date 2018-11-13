const app = require('express')();
const fs = require('fs');

const mongoose = require('mongoose');


const UserModel = mongoose.model('users', {
    id: Number,
    name: String,
    password: String
});

fs.readFile('./db.json', (err, data) => {
    if(err) {
        console.error(err)
    }
    json = JSON.parse(data);
});

app.use((req, res, next) => {
    fs.appendFileSync('./logs/requests.log', `[${new Date(Date.now()).toLocaleString()}] ${req.method} request received (URI: ${req.originalUrl}).\n`);
    next();
});

app.route('/')
    .get((req, res) => { 
        UserModel.find({})
            .then(result => {
                res.json(result);
            }).catch(err => {
                console.error(err);
            });

        /*mongoDBClient.db.collection('users').find({}).toArray().then(result => {
            res.json(result) 
        }).catch(err => {
            console.error(err);
        });*/
    })
    .post((req, res) => {

        UserModel.create({
            "id": parseInt(req.body.id),
            "name": req.body.name,
            "password": req.body.password
        }).then(result => {
            res.json(result);
        }).catch(err => {
            console.error(err);
        });
        
        /*mongoDBClient.db.collection('users').insertOne({
            "id": req.body.id,
            "name": req.body.name,
            "password": req.body.password
        });*/

        res.send("Request successful");

        /*let User = {
            id: (typeof req.body.id !== 'undefined') ? req.body.id : json.users.length + 1,
            name: req.body.name,
            password: req.body.password
        }
        json.users.push(User);

        fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));*/
     });
app.get('/:userId', (req, res) => {

    UserModel.find({ "id": parseInt(req.params.userId) })
    .then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
    });;

    /*mongoDBClient.db.collection('users').find({ "id": parseInt(req.params.userId) }).toArray().then(result => {
        res.json(result) 
    }).catch(err => {
        console.error(err);
    });*/
    //res.json(json.users.find(x => x.id == req.params.userId))
 });
app.put('/:userId', (req, res) => {
    
    UserModel.findByIdAndUpdate(parseInt(req.params.userId), {
        "id": req.body.id,
        "name": req.body.name,
        "password": req.body.password
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
    });
    

    /*mongoDBClient.db.collection('users').findOneAndReplace(
        { "id": parseInt(req.params.userId) },
        {
            "id": req.body.id,
            "name": req.body.name,
            "password": req.body.password
        });*/

        res.send("Request successful");
    /*let user = json.users.find(x => x.id == req.params.userId);

    list.name = req.body.name;
    list.password = req.body.password;

    fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));*/
});
app.delete('/:userId', (req, res) => {
    
    UserModel.findByIdAndDelete(parseInt(req.params.userId));

    /*mongoDBClient.db.collection('users').deleteOne({
        "_id": req.params.userId
    });*/

    res.send("Request successful");
    //let i = json.users.findIndex(x => x.id == req.params.userId);

    //json.users.splice(i,1);

    //fs.writeFileSync('./db.json', JSON.stringify(json, null, 4));
});

// MiddleWare errors
app.use((err, req, res, next) => {
    fs.appendFileSync('./logs/errors.log', `[${new Date(Date.now()).toLocaleString()}] Error catched on ${req.method} request. \n ==> URI: ${req.originalUrl}.\r\n`);
    next();
});

module.exports = app;