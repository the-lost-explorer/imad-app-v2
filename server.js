var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user:'the-lost-explorer' ,  
    database:'the-lost-explorer',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password : 'db-the-lost-explorer-26100'
};

var app = express();
app.use(morgan('combined'));

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
  
  pool.query("SELECT * FROM article WHERE title = '"+ req.params.articleName,"'",function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          if(result.rows.length === 0){
              res.status(404).send('Article not found');
          }else{
              var articleData = result.row[0];
              res.send(createTemplate(articleData));
          }
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
