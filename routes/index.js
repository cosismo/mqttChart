var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:topic', function(req, res, next) {
  req.params;
  res.render('index', { topicv : req.params.topic, mqttBroker : req.app.get('mqttBroker') });
});

module.exports = router;
