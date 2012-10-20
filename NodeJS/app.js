
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

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
    // generate random string: 6 chars, [0-9][a-z]
    // TODO implement NOID
    var id = Math.random().toString(36).substring(12);
    
    var uploadfile = req.files.image.path;

	// parse file timestamp, generate path in repo for this object
    var moment = require('moment');
	var tsstring = req.files.image.lastModifiedDate;
    var tspath = "../repo/" + moment(tsstring).format("YYYY/MM/DD") + "/" + id;

	// make object directory (uses node-mkdirp)
	mkdirp(tspath, function (err) {
		if (err) console.error(err)
		else console.log('pow!')
	});

	fs.writeFile(tspath + "/upload.json", JSON.stringify(req.files), function(err) {
    	if(err) {
        	console.log(err);
	    } else {
    	    console.log("The file was saved!");
	    }
	}); 


	// compute file paths for upload file and output file (=output of conversion to .jpg)
	var targetfile = tspath + "/" + req.files.image.name;
    var outputfile = targetfile.substr(0, targetfile.lastIndexOf('.')) + ".jpg";
    
    var sys = require('sys')
	var exec = require('child_process').exec;
	// move upload file into object directory, using original file name
	exec("mv \"" + uploadfile + "\" \"" + targetfile + "\"", output1);
	
    // after mv, run convert to generate .jpg
    function output1(error, stdout, stderr) {
		exec("convert \"" + targetfile + "\" \"" + outputfile + "\"; identify \"" + outputfile + "\"", output2);
	}
	
	// after convert, generate html output for response
    function output2(error, stdout, stderr) {
	    r = "<html><body><h1>Spalatum upload complete</h1>" +
	    "<table>" +
	    "<tr><td>File</td><td>" + req.files.image.name + "</td></tr>" +
	    "<tr><td>Size</td><td>" + req.files.image.size + "</td></tr>" +
	    "<tr><td>Mime-type</td><td>" + req.files.image.type + "</td></tr>" +
	    "<tr><td>Object directory</td><td>" + tspath + "</td></tr>" +
	    "<tr><td>JPG conversion result</td><td>" + stdout + "</td></tr>" +
	    "</body></html>";
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

