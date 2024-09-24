# Project Gold

## Introduction
A brief description of what this project does and who it's for

## Tech Stack

**Client:** React, Material-UI, Flutter

**Server:** Node, Express

**Database:** MySQL

**Code Repo:** Github

**Hosted:** Domain -> babalhost, Cloudflare and AWS(Ec2)

## Deployment

Use of Docker

```bash
  docker build -t project-gold .
```

```bash
  docker run -p 3000:3000 project-gold
```
Clone Github repository and run locally

```bash
  git clone https://github.com/digigoldbook/nodejs-backend.git
```

```bash
  cd nodejs-backend && npm install
```

If you have not install nodemon then only follow this step.
```bash
  npm install -g nodemon
```

```bash
  nodemon
```

## Documentation

### Login and Registration
username: admin
password: admin

### Users
Completed Features
  1. List of Users for Admin
  2. Reset Password
  3. Update Role
  5. Search Users
  6. Delete User

### Feedback
Completed Features
  1. Send Feedback
  2. Update Status
  3. List all Feedback

### Shop
Completed Features
  1. Add a New Shops
  2. List all Shops
  3. On the basis of step 2 we can filter and display member shop only
  4. Delete Shop
  5. Edit Shop Details

## Support
For support, email abishekkhanal2056@gmail.com