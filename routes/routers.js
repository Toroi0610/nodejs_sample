var express = require('express');
var router = express.Router();

var title = "Socket.io Chat";

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  var now = new Date();
  console.log('Time: ', now)
  next()
})


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: title });
});


/* GET user regist page. */
router.get('/user-regist', function(req, res) {
  console.log('Request Type:', req.method);
  res.render('user_upload', { title: title });
});


/* GET room create page. */
router.get('/create-room', function(req, res) {
  console.log('Request Type:', req.method);
  res.render('create_chat_room', { title: title });
});


/* GET room create page. */
router.post('/confirm', function(req, res) {
  console.log('Request Type:', req.method);
  console.log('Request Type:', req.body);
  res.render('confirm', { title : title,
                          roomname : req.body.roomname,
                          username : req.body.username
                        }
            );
});


/* GET chat room page. */
router.post('/chatroom', function(req, res) {
  console.log('Request Type:', req.method);
  console.log('Request Type:', req.body);
  res.render('chatroom', { title : title,
                           roomname : req.body.room,
                           username : req.body.user
                        }
            );
});


module.exports = router;
