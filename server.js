var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user:	'the-lost-explorer' ,  
    database:	'the-lost-explorer',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password:	DB_PASSWORD
};







var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/sudocode',function(req,res){
    res.sendFile(path.join(__dirname,'ui','sudocode.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var pool = new pg.Pool(config);
app.get('/test-db',function(req,res){
   pool.query('SELECT*FROM test',function(req,res){
       if(err){
           res.status(500).send(err.toString());
       }else{
           res.send(JSON.stringify(result));
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
