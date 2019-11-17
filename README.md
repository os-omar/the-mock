# The-Mock [![](https://badge.fury.io/js/the-mock.svg)](http://badge.fury.io/js/the-mock)

* Create & Delete REST API End-Points dynamically from a deployed the-mock server.
* First mock server where mock data are stored in NoSQL "MongoDB" Database and not locally, 
thus these mock data are created once and can be shared across all Front-End development team.
* It is useful for companies which both B-E & F-E teams works parallelly. 
* Created for both Front-End developers and testers who needs a quick RESTful API back-end solution, in case there is none.
* No __coding__ involved, it has a nice UI and with few clicks a mock end-point can be created.
* It can be deployed to an online server.

## Table of contents

- [Installation](#installation)
- [Getting Started](#getting-started)
  * [Create a MongoDB database](#create-a-mongodb-database)
  * [Create a ```config.json``` file](#create-a-configjson-file)
  * [Create a ```server.js``` file](#create-a-serverjs-file)
- [The-Mock server GUI](#the-mock-server-gui)
- [Mock Rest Api Creation](#mock-rest-api-creation)
  * [Create a path](#create-a-path)
  * [Create a resource](#create-a-resource)
- [How to achieve a Success/Error response](#how-to-achieve-a-successerror-response)
  * [Examples](#examples)
- [License](#license)

## Installation
The choice is yours:
* `npm i the-mock`
* `yarn add the-mock`

## Getting Started

To run The-Mock Server successfully, 3 steps need to be handled.

### Create a MongoDB database

If you already have a MongoDB, skip to the second step. If not: 
* Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a DB as a service, it's __FREE FOREVER__ when you choose:<br /> __"M0 - Standard RAM & 512MB storage"__.
* OR [Install MongoDB](https://docs.mongodb.com/v3.2/installation) on your machine to run it locally.

__Important Notes:__ 
* the-mock server will use both MongoDB models __'p'__ & __'r'__ to store mock data.<br /> 
  __'p'__: stands for Paths, while __'r'__: for path Resources.
* It's recommeneded to use __MongoDB Atlas__, so the mock data can be shared across Front-End development team.<br />
Here is the [Atlas Documentation](https://docs.atlas.mongodb.com) explaining how to create one.

### Create a ```config.json``` file

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

### Create a ```server.js``` file

The-Mock Server is created using [Express JS](https://expressjs.com/), thus it needs a starting point to run.<br />
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

## The-Mock server GUI

The-Mock server has a friendly GUI which can easily lead you to create mock end-points.<br />
just navigate to:
* http://localhost:3000, if the-mock server is run locally.
* http://your-domain, if the-mock server is deployed online.

## Mock Rest Api Creation

To create a Mock Rest Api successfully, 2 steps need to be handled.

### Create a path

The path is all your URL except your domain, paths must be unique. exmaples:
* List: __/api/v1.0/users__
* Singular: __/api/v1.0/users/12__
* Query: __/api/v1.0/users?department=EDU&year=1992__.

__Important Notes:__ 
* For a __Singular Path__, avoid this format: __/api/v1.0/users/{id}__, 
as the-mock server reads the end-point exactly as it is. There is no changing in path's variables.
* Both __/p/*__ & __/r/*__ are reserved paths and cannot be mock.
* To call your end-point: http://your-domain/your-path. e.g: __http://localhost:3000/api/v1.0/users/12__
* Before Calling your mock end-point, at least one resource must be created.

### Create a resource

Basically each path has many resources e.g: __GET, POST, PUT, DELETE ..etc__, 
and to create one click on a specific path. It will navigate you to Resources page.<br />
__How to create a resource ?__ when you click on + sign a box will show up that contains:
 - __"method"__: type __"" sting__ only. It's required field and must be unique.
 - __"headers"__: type  __{} object__ only. It can be an __empty {} object or removed__, if you don't need headers.
 - __"reqBody"__: type __{} object or [] Array__. It can be __Removed__, if you don't need a request body.
 - __"success"__: it's the successful response, which consists of:
   * __"statusCode"__: type __"" sting or integer__, it's HTTP response status code. "200" is the default value.
   * __"resBody"__: type __any__, it's response body data.
 - __"error"__: it's the failed response, which consists of:
   * __"statusCode"__: type __"" sting or integer__, it's HTTP response status code. "500" is the default value.
   * __"resBody"__: type __any__, it's response body data.

__Important Notes:__ 
* Only __"method"__ is required to fill in, and it must be unique. Other fileds can be __Removed__.
* Create resource form must be a valid JSON format.
* All form field keys are case-sensitive. Meaning __"method"__ is not equal to __"METHOD"__. In order for the-mock server to work successfully, avoid changeing/adding any key names.
* After creating a resource, try calling the end-point using Browser, Postman ..etc.

## How to achieve a Success/Error response

The-Mock server compares request Api call data with the data stored in the-mock database.<br />
If they are __EXACTLY EQUAL "==="__. The-Mock returns a seccessful response, otherwise it returns a failed response.<br />
In other words:
* __Successful Response:__ reqData === dbData.
* __Error Response:__ reqData !== dbData.

### Examples

| Request Api Call | The-Mock Stored Data | Response | Reason
| ---- | ---- | ---- | ---- |
| __path:__ /api/v1.0/posts<br /> __method:__ GET<br /> __headers:__ {} | __path:__ /api/v1.0/posts<br /> __method:__ GET<br /> __headers:__ {} | __success__ | EXACTLY EQUAL __"==="__ | 
| __path:__ /api/v1.0/posts/2<br /> __method:__ GET<br /> __headers:__ { "authorization": "Bearer blahBlah" } | __path:__ /api/v1.0/posts/1<br /> __method:__ GET<br /> __headers:__ { "authorization": "Bearer fake-jwt" } | __error__ | request __path__ should be __/posts/1__<br /> request __headers__ should be __{ "authorization": "Bearer fake-jwt" }__ |
| __path:__ /api/v1.0/posts/2<br /> __method:__ GET<br /> __headers:__ { "authorization": "Bearer fake-jwt" } | __path:__ /api/v1.0/posts/2<br /> __method:__ GET<br /> __headers:__ { "authorization": "Bearer fake-jwt" } | __success__ | EXACTLY EQUAL __"==="__ |
| __path:__ /api/v1.0/posts<br /> __method:__ PUT<br /> __headers:__ { "authorization": "Bearer fake-jwt" }<br /> __body:__ { "title": "The Mock 1", "content": "the easiest way to mock end-points" }| __path:__ /api/v1.0/posts<br /> __method:__ POST<br /> __headers:__ { "authorization": "Bearer fake-jwt" }<br />  __reqBody:__ { "title": "The Mock", "content": "the easiest way to mock end-points" }  | __error__ | request __method__ should be __"POST"__<br /> request __body.title__ should be __"The Mock"__ |
| __path:__ /api/v1.0/posts?department=GOV&year=1990<br /> __method:__ GET<br /> __headers:__ {} | __path:__ /api/v1.0/posts?department=EDU&year=1992<br /> __method:__ GET<br /> __headers:__ {} | __error__ | request __path query__ should be __department=EDU&year=1992__ |

## License

Code licensed under MIT.