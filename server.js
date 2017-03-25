var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
const crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = {
    user:'the-lost-explorer' ,  
    database:'the-lost-explorer',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password : 'db-the-lost-explorer-26100'
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'thisismysecret',
    cookie:{ maxAge : 1000*60*60*24*30}
}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/sudocode',function(req,res){
    res.sendFile(path.join(__dirname,'ui','sudocode.html'));
});
app.get('/ui/:fileName', function (req, res) {
  var fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, 'ui', fileName));
});

//sql stuff
var pool = new Pool(config);
app.get('/articles/:articleName',function(req,res){
  
 // articleName === article-one;
//  artciles[articleName] == {} 
  
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName],function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          if(result.rows.length === 0){
              res.status(404).send('Article not found');
          }else{
              var articleData = result.rows[0];
              res.send(articleData);
          }
      }
  });
});




//Hashing
function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
    var hashedString = hash(req.params.input,'thisissomerandomstring');
    res.send(hashedString);
});


//Create user

app.post('/create-user',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)',[username,dbString],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           res.send('User successfully created'+username);
       }
   });
   
});



//Login user

app.post('/login',function(req,res){
     pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           if(result.rows.length === 0 ){
               res.status(403).send('username/password invalid');
           }else{
               var dbString = result.rows[0].password;
               var salt = dbString.split('$')[2];
               var hashedPassword = hash(password,salt);
               if(hashedPassword ===dbString){
                   res.send('logged in');
               }else{
                   res.status(402).send('username/password is invalid');
               }
           }
           res.send('User successfully created'+username);
       }
   });
});











counter = 0;
app.get('/counter',function(req,res){
    counter = counter + 1;
    res.send(counter.toString());
})
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
