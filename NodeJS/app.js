
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
    app.use(express.bodyParser({
    uploadDir: __dirname + '/../repo',
    keepExtensions: true
    }));
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
    //res.send(console.dir(req.files));
    
    /*
    { image: 
   { size: 25039,
     path: '/Users/peterbinkley/data/spalatum/repo/b12c3f18861289206ad7168be7672ffb.png',
     name: 'Screen Shot 2012-10-18 at ~ Oct 18 ~ 7.20AM 7.20.53 AM.png',
     type: 'image/png',
     hash: false,
     lastModifiedDate: Sat Oct 20 2012 09:43:44 GMT-0400 (EDT),
     _writeStream: 
      { path: '/Users/peterbinkley/data/spalatum/repo/b12c3f18861289206ad7168be7672ffb.png',
        fd: 10,
        writable: false,
        flags: 'w',
        encoding: 'binary',
        mode: 438,
        bytesWritten: 25039,
        busy: false,
        _queue: [],
        _open: [Function],
        drainable: true },
     length: [Getter],
     filename: [Getter],
     mime: [Getter] } }
    */
    
    var imagefile = req.files.image.path;
    var outputfile = 'test.jpg';
    
    var sys = require('sys')
	var exec = require('child_process').exec;
	exec("convert " + imagefile + " " + outputfile + "; identify " + outputfile, output);
    function output(error, stdout, stderr) {
    
    
    r = "<html><body><p>Size: " + req.files.image.size + "</p><p>Mime-type: " + 
    	req.files.image.type + "</p><p>Convert result: " + stdout + "</p></body></html>";
    res.send(r);
    
    }
    
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
//        console.log(data);
//        console.log("bork");
    //    console.log(req);
    //console.log(data);
    });
    
});

