var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res) {
  console.log('Request Type:', req.method)
  res.render('user_upload', { title: 'Socket.io Chat' });
});

module.exports = router;
