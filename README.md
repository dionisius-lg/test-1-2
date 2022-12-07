# Express API

This application is built with [Express](https://expressjs.com) 4.x

Before installing, download and install Node.js. Node.js 0.10 or higher is required.

## Installation

1. Git clone or pull this source.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the server.

Open `.env` file, then setup the 'Datasources' and any other
configuration relevant for your application.

## How to use

### Get List Users Data

Request `GET` list users data, example `http://localhost:8000`

### Get Detail of Data

Request `GET` detail user data by kduser, example `http://localhost:8000/1`

### Create New Data

Request `POST` to create new user data, example `http://localhost:8000`

### Update Existing Data

Request `PUT` to update existing user data by kduser, example `http://localhost:8000/2`

### Delete Existing Data

Request `DELETE` to delete existing user data by kduser, example `http://localhost:8000/2`

