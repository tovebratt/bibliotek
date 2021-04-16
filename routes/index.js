var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/books", function(req, res){
  console.log(req.body);
  res.json(books)
})

module.exports = router;
