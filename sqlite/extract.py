#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys

repo = '../repo/'
f = open(repo + 'index.html', 'w')

con = lite.connect('spalatum.db')

f.write("<html><head><title>Spalatum Index</title></head>")
f.write("<body><h1>Spalatum Index</h1>")
f.write("<ul>")

with con:
	con.row_factory = lite.Row
	              
	cur = con.cursor() 
	cur.execute("SELECT * FROM files")

	rows = cur.fetchall()

	for row in rows:
	    f.write("<li>%s. <a href=\"%s\">%s</a></li>" % (row["id"], row["path"], row["title"]))

f.write("</ul></body></html>")
f.close()
