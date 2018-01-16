const pool = require('../modules/pool');

const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    console.log('hit get koalas');

    const queryText = 'SELECT * FROM koala ORDER BY id';
    pool.query(queryText)
        .then((result) => {
            console.log('query results:', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.get('/:id', function(req, res) {
    console.log('hit get koalas');

    const queryText = 'SELECT * FROM koala WHERE id=$1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('query results:', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.put('/update/:id', (req, res) => {
    const queryText = 'UPDATE koala SET name = $1, age = $2, gender = $3, ready_to_transfer = $4, notes = $5 WHERE id = $6';
    pool.query(queryText, [req.body.name, req.body.age, req.body.gender, req.body.ready_to_transfer, req.body.notes, req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.put('/:id', (req, res) => {
    const queryText = 'UPDATE koala SET ready_to_transfer = $1 WHERE id = $2';
    pool.query(queryText, [req.body.ready_to_transfer, req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.post('/', function(req, res) {
    const queryText = 'INSERT INTO koala (name, gender, age, ready_to_transfer, notes) VALUES ($1, $2, $3, $4, $5)';
    pool.query(queryText, [req.body.name, req.body.gender, req.body.age, req.body.ready_to_transfer, req.body.notes])
        .then((result) => {
            console.log('result:', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.delete('/:id', function(req,res) {
    const queryText = 'DELETE FROM koala WHERE id = $1';
    pool.query(queryText,[req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });

});
module.exports = router;