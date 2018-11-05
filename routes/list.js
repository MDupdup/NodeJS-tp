const express = require('express');
const router = express.Router();

const fs = require('fs');

router.get('/all', (req, res) => {

    let jsonData;

    fs.readFile('./db.json', (err, data) => {
        if(err) {
            console.error(err)
        }

        jsonData = JSON.parse(data);

        res.render('index', {
            'title': 'TP',
            'message': 'liste complète',
            'json': jsonData
        });
    })
});

router.get('/detail/:userId', (req, res) => {
    fs.readFile('./db.json', (err, data) => {
        if(err) {
            console.error(err)
        }

        jsonData = JSON.parse(data);

        res.render('index', {
            'title': 'TP',
            'message': 'liste complète',
            'user': jsonData.users.find(x => x.id === req.params.userId)
        });
    })
})

module.exports = router;