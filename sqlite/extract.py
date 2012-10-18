#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import os, sys

def starthtml(f):
	f.write("<html><head><title>Spalatum Index</title></head>")
	f.write("<body><h1>Spalatum Index</h1>")
	f.write("<ul>")
	
def endhtml(f):
	f.write("</ul></body></html>")
	f.close()

repo = '../testrepo/'
f = open(repo + 'index.html', 'w')
starthtml(f)

con = lite.connect('spalatum.db')

with con:
	con.row_factory = lite.Row
	              
	cur = con.cursor() 
	cur.execute("SELECT * FROM files")

	rows = cur.fetchall()

	for row in rows:
	    f.write("<li>%s. <a href=\"%s\">%s</a></li>" % (row["id"], row["path"], row["title"]))
	    path = row["path"]
	    
	    
	    item = open(repo + path + "/index.html", "w")
	    starthtml(item)
	    item.write("<p>This is " + row["title"] + ".</p>")
	    endhtml(item)
	    
endhtml(f)
