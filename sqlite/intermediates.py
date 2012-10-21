#!/usr/bin/python
# -*- coding: utf-8 -*-

# create individual directory-level files:
# repo/2012/index.html etc.
# (at year, month and day level)

import sqlite3 as lite
import os, sys

def starthtml(f):
	f.write("<html><head><title>Spalatum Index</title></head>")
	f.write("<body><h1>Spalatum Index</h1>")
	f.write("<ul>")
	
def endhtml(f):
	f.write("</ul></body></html>")
	f.close()
	
def dodirs(prefix, parenthtml):
	print "Dodirs prefix " + prefix
	
	# if this is top level, take first 4 chars = year; otherwise take
	# current prefix + 3 ("/##")
	
	if prefix == "":
		l = 4
	else:
		l = len(prefix) + 3
		
	if prefix == "":
		offset = 0
	else:
		offset = l - 2
		
	cur.execute("select distinct substr(path, 1, " + str(l) + ") as path from files where path like '" + prefix + "%' order by path;")

	rows = cur.fetchall()

	for row in rows:
		# row contains path = "2012" or "2012/01" or "2012/01/01"
#f.write("<li>%s. <a href=\"%s\">%s/index.html</a></li>" % (row["id"], row["path"], row["title"]))
	    path = row["path"]
	    print "Doing: " + path

	    parenthtml.write("<li><a href=\"" + path[offset:] + "/index.html\">" + path + "</a></li>")
	    
	    # if we haven't reached the item level, recurse to subdirectories
	    if (len(path) < 9):
			item = open(repo + path + "/index.html", "w")
			starthtml(item)
			item.write("<p>This is " + path + ".</p>")
			print "Recursing on " + path
			item.write("<ul>")
			dodirs(path, item)
			item.write("</ul>")
			endhtml(item)

repo = '../repo/'

con = lite.connect('spalatum.db')

with con:
	con.row_factory = lite.Row
	              
	cur = con.cursor() 
	
	root = open(repo + "/index.html", "w")
	starthtml(root)
	dodirs("", root)
	endhtml(root)