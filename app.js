var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// command option 
var program = require("commander");

program
    .option("-f, --flag", "On/Off flag.")
    .option("-m, --message <s>", "Show message.", "Hello World.")
    .option("-i, --integer <n>", "Numeric value.", parseInt, 10)
    .option("-l, --list <items>", "Listed value.", (value) => { return (value || []).split(","); }, [])
    .option("-s, --size <size>", "Selected size.", /^(large|medium|small)$/i, "medium")
    .option("-o, --option [value]", "Option value.")
    .option("-v, --variadic [items...]", "Variadic value.")
    .parse(process.argv);

if (process.argv.length < 3) {
    program.help();
}

for (let i = 0; i < process.argv.length; i++) {
    console.log(`argv[${i}] = ${process.argv[i]}`);
}

var run_mode = process.argv[3]

if (run_mode == "local"){
    var http = require("http").Server(app);
    const PORT = process.env.PORT || 7000;
    var server = http.listen(PORT);
    console.log("Server: Local");
} else {
    var http = require("http");
    var server = http.createServer(app).listen(process.env.PORT);
    console.log("Server: Cloud");
}

// ユーザ管理ハッシュ
var userHash = {};

// io
const io = require("socket.io")(server);
io.on("connection", function(socket){
    // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
    socket.on("connected", function (name) {
        var msg = "入室しました";
        userHash[socket.id] = name;
        io.emit("message", {username : user, message : msg});
    });

    // メッセージ受信時イベント
    socket.on("message", function(msg){
        // socket.idからユーザー名を取り出す．
        var user = userHash[socket.id];
        console.log("[Message] :: " + user + ":" + msg);
        io.emit("message", {username : user, message : msg});
    });

    // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
    socket.on("disconnect", function () {
        if (userHash[socket.id]) {
            var msg = "退出しました";
            delete userHash[socket.id];
            io.emit("message", {username : user, message : msg});
        }
    });

});

// output console
// http.listen(PORT, function(){
//     console.log('server listening. Port:' + PORT);
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
