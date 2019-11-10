# The-Mock [![](https://badge.fury.io/js/the-mock.svg)](http://badge.fury.io/js/the-mock)

* Create & Delete REST API End-Points dynamically from a deployed the-mock server.
* Created for both Front-End developers and testers who needs a quick RESTful API back-end solution, in case there is none.
* No __coding__ involved, it has a nice UI and it can be deployed to an online server.

## Getting Started

To run The-Mock Server successfully, 3 steps need to be handled.

### 1) Create A MongoDB Database

If you already have a MongoDB, skip to the second step.<br />
if not, visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - it's free forever when you choose __M0 - Standard RAM & 512MB storage.__<br />
OR [Install MongoDB](https://docs.mongodb.com/v3.2/installation) on your machine to run locally.

### 2) Create a ```config.json``` file

Inside the root project folder create ```config.json``` file to link the-mock server with MongoDB<br />
and to handle CORS issue by passing response headers.
```
{
    "db": {
        "url": "mongodb://localhost:27017/the-mock",
        "options": {
            "useNewUrlParser": true,
            "useUnifiedTopology": true
        }
    },
    "headers": {
        "all": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true
        },
        "options": {
            "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
        }
    }
}
```
### 3) Create a ```server.js``` file

The-Mock Server is created it using [Express JS](https://expressjs.com/), thus it needs a starting point to run.<br />
Inside the root project folder create ```server.js``` file:
```
// server.js
const http = require('http');
const theMock = require('the-mock');

const port = process.env.PORT || 3000;
theMock.setConfig('config.json');
const server = http.createServer(theMock);

server.listen(port, () => {
    console.log(`The-Mock server is running on Port ${port}`);
    console.log(`open your browser on http://localhost:${port}`);
});
```
then run the-mock server by this commad ```node server.js```.

## The-Mock Server GUI

The-Mock server has a friendly GUI which can easily lead you to create mocked end-points.<br />
just navigate to http://localhost:3000, if you run it locally.<br />
OR to http://your-domain, if the-mock server is deployed online.<br />
To create an end-point first create a path e.g: __/the-mock/server?name=os__<br />
then create resource/s for it e.g: __GET, POST ..etc__

## License

Code licensed under MIT.