const express = require("express");
const sqlite3 = require("sqlite3");
var bodyParser = require('body-parser')
const morgan = require("morgan")
const index = express();

module.exports = index;

const PORT = process.env.PORT || 4001

index.use(bodyParser.json());

index.use(express.static('public'));

index.use(morgan("dev"));

const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

index.get('/strips', (req, res, next) =>{
  db.all('SELECT * FROM Strip', (err, rows) =>{
    if(err) {
      res.sendStatus(500);
    } else {
       res.send({ strips: rows });
    }

  });
});
const validateStrip = (req, res, next) => {
const stripToCreate = req.body.strip;
if (
  !stripToCreate.head ||
  !stripToCreate.body ||
  !stripToCreate.background ||
  !stripToCreate.bubbleType 
){
  return res.sendStatus(400); //Bad Request
}
next()
};
index.post('/strips', validateStrip, (req, res, next) => {
const stripToCreate = req.body.strip;
db.run(
  `INSERT INTO Strip (head, body, bubble_type, background, bubble_text, caption) 
  VALUES ($head, $body, $bubble_type, $background, $bubble_text, $caption)`, 
  {
    $head: stripToCreate.head, 
    $body: stripToCreate.body, 
    $bubbleType: stripToCreate.bubbleType, 
    $background: stripToCreate.background, 
    $bubbleText: stripToCreate.bubbleText, 
    $caption: stripToCreate.caption, 
  }, 
  function(err) {
    if(err) {
      return res.sendStatus(500) //Internal Server Error 
    }
    db.get(`SELECT * FROM Strip WHERE id = ${this.lastID}`, (err,rows) =>{
      if(!row) {
        return rez.sendStatus(500);
      }
      res.status(201).send({
        strip: row
      })
    })
  }
  )
});

index.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
