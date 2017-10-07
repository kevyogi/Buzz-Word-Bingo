const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const qs = require('qs');
const urlencodedParser = bodyParser.urlencoded({ extended: true });

let app = express();
let PORT = process.env.PORT || 3000;

const theBuzzWords = [];
let score = 0;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/buzzwords', (req, res) => {
  res.json({"buzzWords": theBuzzWords});
});

app.route('/buzzword')
.post(urlencodedParser, (req, res) => {
  if(!req.body){
    return res.sendStatus(400);
  }else if(theBuzzWords.length === 0){
    theBuzzWords.push(req.body);
    res.json({"success": true});
  }else{
    let wordIsThere = theBuzzWords.some((element) => {
      return element.buzzWord === req.body.buzzWord;
    })
    if(wordIsThere === true){
      return res.sendStatus(400);
    }else{
      theBuzzWords.push(req.body);
      res.json({"succes": true});
    }
  }
})
.put(urlencodedParser, (req, res) => {
  if(!req.body){
    return res.sendStatus(400);
  }else{
    for(let i = 0; i < theBuzzWords.length; i++){
      if(req.body.buzzWord === theBuzzWords[i].buzzWord && req.body.heard === 'true'){
        theBuzzWords[i].heard = 'true';
        score += Number(theBuzzWords[i].points);
        res.json( {"success": true, "newScore": score} );
      }else{
        res.sendStatus(400);
      }
    }
  }
})
.delete(urlencodedParser, (req, res) => {
  if(!req.body){
    res.sendStatus(400);
  }else{
    for(let i = 0; i < theBuzzWords.length; i++){
      if(req.body.buzzWord !== theBuzzWords[i].buzzWord){
        res.sendStatus(404);
      }else if(req.body.buzzWord === theBuzzWords[i].buzzWord){
        theBuzzWords.splice(i, 1);
        res.json( {"success": true} );
      }
    }
  }
})

app.listen(PORT, (err) => {
  console.log(`Server running on port: ${PORT}`);
});
