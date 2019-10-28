# Mock-Server

 Create & Delete REST API End-Points dynamically from a deployed mock-server.<br />
 Created for both Front-End developers and testers who needs a quick RESTful API back-end solution, in case there is none.<br />
 No __coding__ involved, it has a nice UI and it can be deployed to an online server.

## Getting Started

To run Mock-Server successfully, 3 steps need to be handled.

### 1) Create A MongoDB Database

If you already have a MongoDB, skip to the second step.<br />
if not, visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - it's free forever when you choose __M0 - Standard RAM & 512MB storage.__<br />
OR [Install MongoDB](https://docs.mongodb.com/v3.2/installation) on your machine to run locally.

### 2) Create a ```config.json``` file

Inside the root project folder create ```config.json``` file to link mock-server with MongoDB<br />
and to handle CORS issue by passing response headers.
```
{
    "db": {
        "url": "mongodb://localhost:27017/mock-server",
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

Mock-Server is created it using [Express JS](https://expressjs.com/), thus it needs a starting point to run.<br />
Inside the root project folder create ```server.js``` file:
```
// server.js
const http = require('http');
const mockServer = require('mock-server');

const port = process.env.PORT || 3000;
mockServer.setConfig('config.json');
const server = http.createServer(mockServer);

server.listen(port, () => {
    console.log(`The mock-server is running on Port ${port}`);
    console.log(`open your browser on http://localhost:${port}`);
});
```
then run the mock-server by this commad ```node server.js```.

## Mock-Server GUI

mock-server has a friendly GUI which can easily lead you to create mocked end-points.<br />
just navigate to http://localhost:3000, if you run it locally.<br />
OR to http://your-domain, if mock-server is deployed online.<br />
To create an end-point first create a path e.g: __/mock/server?name=os__<br />
then create resource/s for it e.g: __GET, POST ..etc__

## Links

[npm package](#)

## License

Code licensed under MIT.