#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Read the file in binary mode to preserve exact bytes
with open(r'c:\Users\ACER\Downloads\rag.json', 'rb') as f:
    content = f.read()

# Replace smart quotes (UTF-8 encoded)
# \xe2\x80\x9c = Left double quotation mark (")
# \xe2\x80\x9d = Right double quotation mark (")
# \xe2\x80\x98 = Left single quotation mark (')
# \xe2\x80\x99 = Right single quotation mark (')

content = content.replace(b'\xe2\x80\x9c', b'"')
content = content.replace(b'\xe2\x80\x9d', b'"')
content = content.replace(b'\xe2\x80\x98', b"'")
content = content.replace(b'\xe2\x80\x99', b"'")

# Write back
with open(r'c:\Users\ACER\Downloads\rag.json', 'wb') as f:
    f.write(content)

print("Fixed smart quotes in rag.json")

