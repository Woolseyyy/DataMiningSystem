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

    //send to Huang Qihao

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
  Query.find({_id:queryID}, function (err, query) {
      var statue = query.statue;
      res.json({
          code:0,
          msg:'ok',
          body:{
            statue:statue
          }
      })
  })
});

router.post('statue', function(req, res, next){
  var queryID = req.query.queryID;
  var statue = req.query.queryID;
  var data = req.query.data;
      Query.find({_id:queryID}, function (err, query) {
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
  Query.find({_id:id}, function (err, query) {
      res.render('view', {data: query.data})
  })
});

module.exports = router;
