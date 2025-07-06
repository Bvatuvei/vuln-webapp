# Vulnerable Web App (For Educational Use Only)

This is a purposely insecure Node.js, and MongoDB web application, built for penetration testing practice and learning purposes, it is not meant to be used in actual online projects.

⚠️ **Do not deploy this app on the public internet.**  
It contains insecure login logic, unvalidated inputs, and is vulnerable to NoSQL injection, session spoofing, and brute-force attacks.

## Features
- Insecure login (NoSQL injection)
- Cookie-based session spoofing
- No password hashing
- MongoDB + Mongoose backend

## Use This For:
- Burp Suite practice
- Hydra brute-force testing
- Manual exploitation (cookies, injection, logic flaws)

