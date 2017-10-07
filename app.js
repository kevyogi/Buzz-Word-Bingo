const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const qs = require('qs');
const urlencodedParser = bodyParser.urlencoded({ extended: true });

let app = express();
let PORT = process.env.PORT || 3000;

let theBuzzWords = [];
let score = 0;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/buzzwords', (req, res) => {
  res.json({"buzzWords": theBuzzWords});
});

app.route('/buzzword')
.post(bodyParser.urlencoded({extended: true, parameterLimit: 3}), (req, res) => {
  let wordIsThere = theBuzzWords.some((element) => {
    return element.buzzWord === req.body.buzzWord;
  });
  if(theBuzzWords.length === 5 || !(req.body.buzzWord)|| !(req.body.heard === 'false') || !(Number(req.body.points)) || wordIsThere === true){
    return res.json({"success:": false});
  }else if(wordIsThere === false || theBuzzWords.length === 0){
    req.body.points = Number(req.body.points);
    req.body.heard = false;
    theBuzzWords.push(req.body);
    res.json({"success": true});
  }
})
.put(urlencodedParser, (req, res) => {
  if(!req.body || theBuzzWords.length === 0){
    return res.json({"success": false});
  }else{
    for(let i = 0; i < theBuzzWords.length; i++){
      if(req.body.buzzWord === theBuzzWords[i].buzzWord && req.body.heard === 'true'){
        theBuzzWords[i].heard = true;
        score += theBuzzWords[i].points;
        return res.json( {"success": true, "newScore": score} );
      }else if(i === theBuzzWords.length-1){
        return res.json({"success": false});
      }
    }
  }
})
.delete(urlencodedParser, (req, res) => {
  if(!req.body || theBuzzWords.length === 0){
    res.json({"success": false});
  }else{
    for(let i = 0; i < theBuzzWords.length; i++){
      if(req.body.buzzWord !== theBuzzWords[i].buzzWord){
        res.json({"success": false});
      }else if(req.body.buzzWord === theBuzzWords[i].buzzWord){
        theBuzzWords.splice(i, 1);
        res.json( {"success": true} );
      }
    }
  }
})

app.post('/reset', urlencodedParser, (req, res) => {
  if(!req.body){
    res.json({"success": false});
  }else{
    if(req.body.reset === 'true'){
      score = 0;
      theBuzzWords = [];
      res.json({"success": true});
    }else{
      res.json({"success": false});
    }
  }
});

app.listen(PORT, (err) => {
  console.log(`Server running on port: ${PORT}`);
});
