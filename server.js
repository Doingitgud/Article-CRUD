var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = http.Server(app);


app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var articleData = require('./models/articleSchema');

var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/articleData' //change this if we are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) { console.log('MongoDB Connection Succeeded.'); }
  else { console.log('Error in DB connection due to :' + err); }
});


app.get('/', function (request, response) {
  articleData.find({}, function (err, data) { response.render('index', { articleData: data }) })
})

app.get('/newArticle', function (request, response) {
  response.render('newArticle', {
  })

})

app.post('/article/items', function (request, respond) {
  articleData.findOneAndRemove({ _id: request.body.id }, { useFindAndModify: false }, function (err, result) {
    if (err) {
      respond.send(err);
    }
    else {
      respond.send(result);
    }
  });

});

app.post('/newArticle', function (request, response) {
  var newArticleProduct = new articleData(request.body)
  newArticleProduct.save(function (err, data) {
    if (err)
      return response.status(400).json({
        error: 'required data is missing'
      })
    return response.status(200).json({
      message: 'Data inserted into database successfully'
    })
  })
})


app.get('/articleView/:id', function (request, response) {
  articleData.findById(request.params.id, function (err, data) {
    response.render('articleView', { singleArticle: data })
  })
})

app.get('/editArticle/:id', function (request, response) {
  articleData.findById(request.params.id, function (err, data) {
    response.render('editArticle', { singleArticle: data })
  })
})


app.post('/editArticle', function (request, response) {
  const data = request.body;
  articleData.findByIdAndUpdate(data.id, data, { useFindAndModify: false }, function (err, result) {
    if (err) {
      response.send(err);
    }
    else {
      response.send(result);
    }
  })

})

server.listen(process.env.PORT || 3000,
    process.env.IP || 'localhost', function () {
      console.log('Server running');
    })
  module.exports = { app, server, mongoose };