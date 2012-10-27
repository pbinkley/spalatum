/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* Module dependencies */

var mkdirp = require('mkdirp');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var sqlite3 = require('sqlite3');
var sys = require('sys');
var exec = require('child_process').exec;

var winOS = false;
if(process.platform.toString().toLowerCase().substring(0,3)=='win')
    winOS = true;



var Exift = require('exift');
var ex = new Exift();
ex.exiftool = "../exiftool/exiftool";

exports.imgUpload = function(req, res){
    
    var id = Math.random().toString(36).substring(12);
    
    var uploadfile = req.files.image.path;
    var timestamp = "";
    var tspath = "";
    
    ex.readData(uploadfile, function(err, data){
        if(err!=null)
            console.log(err);
        else{
            console.log(data);
            var timestamp = data[0].DateTimeOriginal;
            timestamp = moment(timestamp, "YYYY:MM:DD").format("YYYY/MM/DD");
            createFiles(timestamp, data[0]);
            execDBops(timestamp);
            
        }
    });
    
    function createFiles(timestamp, picData){
        tspath = "../repo/" + timestamp + "/" + id;
        
        // make object directory (uses node-mkdirp)
        mkdirp(tspath, function (err) {
            if (err) console.error(err)
            else {
                console.log('Directory created');
                // create upload.json file which contains metadata on upload's request
                fs.writeFile(tspath + "/upload.json", JSON.stringify(req.files), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Upload data was saved!");
                    }
                }); 
        
                fs.writeFile(tspath + "/picData.json", picData, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Picture was saved!");
                    }
                }); 
            }
        });               
        
        var targetfile = tspath + "/" + req.files.image.name;
        var outputfile = targetfile.substr(0, targetfile.lastIndexOf('.')) + ".jpg";
        
        //   move upload file into object directory, using original file name
        if(winOS)
            exec("move \"" + uploadfile + "\" \"" + targetfile + "\"");
        else
            exec("mv \"" + uploadfile + "\" \"" + targetfile + "\"");
        
        // after mv, run convert to generate .jpg 
        // (*LMP - and also identify what kind of image it is - JPG, PNG...)
        exec("convert \"" + targetfile + "\" \"" + outputfile + "\"; identify \"" + outputfile + "\"", renderResultPage);        
        
    }
    
    function execDBops(timestamp){
        var db = new sqlite3.Database('../sqlite/spalatum.db');
        db.serialize(function(){
            db.run('BEGIN');
            var stmt = db.prepare('INSERT INTO files VALUES (?, ?, ?, ?, ?)');
            stmt.run(id, timestamp, timestamp+"/"+id, req.files.image.name, "");
            stmt.finalize();
            db.run('COMMIT');
        });
                
                
    /*             
        var dbSelectStmt = db.prepare('SELECT * FROM files');
        dbSelectStmt.each(function(err, row){
            console.log(row);
        });
        */
    }
    
    function renderResultPage(error, stdout, stderr){
        r = "<html><body><h1>Spalatum upload complete</h1>" +
        "<table>" +
        "<tr><td>File</td><td>" + req.files.image.name + "</td></tr>" +
        "<tr><td>Size</td><td>" + req.files.image.size + "</td></tr>" +
        "<tr><td>Mime-type</td><td>" + req.files.image.type + "</td></tr>" +
        "<tr><td>Object directory</td><td>" + tspath + "</td></tr>" +
        "<tr><td>JPG conversion result</td><td>" + stdout + "</td></tr>" +
        "</table>" +
        "</body></html>";
        res.send(r);
    }
   
    
    
//  var uploadfile = req.files.image.path;
    
// parse file timestamp, generate path in repo for this object
   
/*if(tsstring.toString().length==0)
        tsstring = req.files.image.lastModifiedDate;*/
    
//  var tspath = "../repo/" + moment(tsstring).format("YYYY/MM/DD") + "/" + id;

// make object directory (uses node-mkdirp)
/* mkdirp(tspath, function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });

    fs.writeFile(tspath + "/upload.json", JSON.stringify(req.files), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); */


// compute file paths for upload file and output file (=output of conversion to .jpg)
// var targetfile = tspath + "/" + req.files.image.name;
// var outputfile = targetfile.substr(0, targetfile.lastIndexOf('.')) + ".jpg";
    
    
// move upload file into object directory, using original file name
//  if(winOS)
//      exec("move \"" + uploadfile + "\" \"" + targetfile + "\"", output1);
//  else
//      exec("mv \"" + uploadfile + "\" \"" + targetfile + "\"", output1);

    
// after mv, run convert to generate .jpg 
// (*LMP - and also identify what kind of image it is - JPG, PNG...)
/*   function output1(error, stdout, stderr) {
        exec("convert \"" + targetfile + "\" \"" + outputfile + "\"; identify \"" + outputfile + "\"", output2);
                
    }*/
	
// after convert, generate html output for response
/*
    function output2(error, stdout, stderr) {
        r = "<html><body><h1>Spalatum upload complete</h1>" +
        "<table>" +
        "<tr><td>File</td><td>" + req.files.image.name + "</td></tr>" +
        "<tr><td>Size</td><td>" + req.files.image.size + "</td></tr>" +
        "<tr><td>Mime-type</td><td>" + req.files.image.type + "</td></tr>" +
        "<tr><td>Object directory</td><td>" + tspath + "</td></tr>" +
        "<tr><td>JPG conversion result</td><td>" + stdout + "</td></tr>" +
        "</table>" +
        "</body></html>";
        res.send(r);
        
        */
        
        
//  }
    
};

