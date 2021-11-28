var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:topic', function(req, res, next) {
  req.params;
  res.render('index', { topicv : req.params.topic });
});

module.exports = router;
