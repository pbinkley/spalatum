#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite

import sys


def readData():
	    
	f = open('spalatum.sql', 'r')
	        
	with f:
		data = f.read()
		return data
				            

con = lite.connect('spalatum.db')

with con:   

	cur = con.cursor()
						    
	sql = readData()
	cur.executescript(sql)
		
con.commit()
							        
