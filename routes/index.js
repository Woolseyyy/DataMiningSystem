var express = require('express');
var router = express.Router();
var Query = require('../db/query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next){
  var itemID = req.body.itemID;
  Query.create({id:itemID}, function(err, query){
    var queryID = query._id;
    var itemID = query._itemID;
    console.log(queryID);
    //start pachong
    const spawn = require('child_process').spawn;
    var child = spawn('python', ['jdComment.py', itemID, queryID]);
    child.stdout.on('data', function(stdout){
        Query.findOne({_id:queryID}, function (err, query) {
            query.statue = 'handling';
            query.save(function (err) {
                console.log(err);
            })
        })
    });

    res.json({
        code:0,
        msg:'ok',
        body:{
          queryID:queryID,
          itemID:itemID
        }
    })
  })
});

router.get('/statue', function (req, res, next) {
  var queryID = req.query.queryID;
  console.log(queryID);
  Query.findOne({_id:queryID}, function (err, query) {
      console.log(query);
      var statue = query.statue;
      console.log(statue);
      res.json({
          code:0,
          msg:'ok',
          body:{
            statue:statue
          }
      })
  })
});

router.post('/statue', function(req, res, next){
  var queryID = req.query.query_id;
  var statue = req.query.statue;
  var data = req.query.data;
      Query.findOne({_id:queryID}, function (err, query) {
          query.statue = statue;
          if(data){
            query.data = data;
          }
          query.save(function (err) {
              console.log(err);
              res.json({
                  code:-1,
                  msg:'修改错误:'+err,
                  body:{}
              });
          })
      })

});

router.get('/view', function(req, res, next){
  var id = req.query.id;
  Query.findOne({_id:id}, function (err, query) {
      res.render('view', {data: query.data})
  })
});

module.exports = router;
