var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mqttBrokerAuto = true;
var mqttBrokerIP = '192.168.1.1';

var indexRouter = require('./routes/index');

var app = express();

function getMqttBrokerIP(){
  const { spawn } = require('child_process');
  const getIP = spawn('sh', ['-c',"ip -o route get to 8.8.8.8 | sed -n 's/.*src \\([0-9.]\\+\\).*/\\1/p'"]);
  getIP.stdout.on('data', (data) => {
    dataStr = data.toString();
    app.set('mqttBroker', dataStr);
  });

  getIP.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
}

/* If mqttBrokerAuto = true, get the main IP of this server,
 else use mqttBrokerIP */

if (mqttBrokerAuto){
  getMqttBrokerIP();
} else {
    app.set('mqttBroker', mqttBrokerIP);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
