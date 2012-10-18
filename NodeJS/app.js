
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, path = require('path');
var fs = require('fs');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = {};

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

//app.get('/', routes.index);
app.get('/', function(req, res){
    res.sendfile(__dirname + '/views/test.html');
})
app.get('/users', user.list);
app.post('/ops/imgUpload', function(req, res){
    res.send(console.dir(req.files));
});

server.listen(3000);
server.debug = false;

io.sockets.on('connection', function(socket){
        
    socket.on('onConnect', function(username){
        socket.username = username;
        usernames[username] = username;
        var length = 0;
        for(var dummy in usernames)length++;
        console.log("User has connected. There are now " + length + " users connected.");        
    });
    
    socket.on('disconnect', function(){
        delete usernames[socket.username];
        var length =0;
        for(var dummy in usernames)length++;
        console.log('User has disconnected. There are now ' + length + " users disconnected.");
    });
    socket.on('fileUpload', function(data){
        console.log(data);
    //console.log(data);
    });
    
});

