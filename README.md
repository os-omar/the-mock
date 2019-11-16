# The-Mock [![](https://badge.fury.io/js/the-mock.svg)](http://badge.fury.io/js/the-mock)

* Create & Delete REST API End-Points dynamically from a deployed the-mock server.
* First mock server where mock data are stored in NoSQL "MongoDB" Database and not locally, 
thus these mock data are created once and can be shared across all Front-End development team.
* It is useful for companies which both B-E & F-E teams works parallelly. 
* Created for both Front-End developers and testers who needs a quick RESTful API back-end solution, in case there is none.
* No __coding__ involved, it has a nice UI and with few clicks a mock end-point can be created.
* It can be deployed to an online server.

## Getting Started

To run The-Mock Server successfully, 3 steps need to be handled.

### 1) Create a MongoDB database

If you already have a MongoDB, skip to the second step. If not: 
- Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a DB as a service, it's __FREE FOREVER__ when you choose:<br /> __"M0 - Standard RAM & 512MB storage"__.
- OR [Install MongoDB](https://docs.mongodb.com/v3.2/installation) on your machine to run it locally.
- __Important Notes:__ 
  * the-mock server will use both MongoDB models __'p'__ & __'r'__ to store mock data.<br /> 
  __'p'__: stands for Paths, while __'r'__: for path Resources.
  * It's recommeneded to use __MongoDB Atlas__, so the mock data can be shared across Front-End development team.<br />
  Here is the [Atlas Documentation](https://docs.atlas.mongodb.com) explaining how to create one.

### 2) Create a ```config.json``` file

Inside the root project folder create ```config.json``` file to link the-mock server with MongoDB and to handle CORS issue by passing response headers.<br />

```config.json``` file contains:
- __"db"__:
  * __"url"__: here you need to add your MongoDB URL that you just created in Step 1, whether it's from Atlas or local DB.
  * __"options"__: an object which will be passed on to your MongoDB driver, it can be blank object though.
- __"headers"__:
  * __"all"__: response headers for __ALL__ REST Api calls.
  * __"options"__: response headers for only __OPTIONS__ method REST Api calls.

__Note:__ you can copy this ```config.json```, then only change __db.url__ to link to your db.
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

The-Mock server has a friendly GUI which can easily lead you to create mock end-points.<br />
just navigate to:
* http://localhost:3000, if the-mock server is run locally.
* http://your-domain, if the-mock server is deployed online.

## Mock Rest Api Creation

To create an Mock Rest Api successfully, 2 steps need to be handled.

### Create a path

the path is all your URL except your domain, paths must be unique. exmaples:
* List: __/api/v1.0/users__
* Singular: __/api/v1.0/users/12__
* Query: __/api/v1.0/users?department=EDU&year=1992__
__Note:__ 
* for __Singular Path__ Do not create it like this __/api/v1.0/users/{id}__, 
as the-mock server reads the end-point exactly as it's. there is no changing in url varibles
* __/p/*__ & __/r/*__ are reserved paths  


To create an end-point first create a path e.g: __/the-mock/server?name=os__<br />
then create resource/s for it e.g: __GET, POST ..etc__

## License

Code licensed under MIT.