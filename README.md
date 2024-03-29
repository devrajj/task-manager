# Task Manager

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)

## Introduction

Contains the backend part of the Task Manager Application. It uses simple api key authentication to authenticate api requests.
The code uses
MongoDB for database and data storage
Typescript as the coding language
Express for creating application
Jest for test cases
Winston Logger for logging

## Prerequisites

- Typescript installed
- npm
- MongoDb setup on local or mongo cloud

## Installation

- ** Clone the repository**:

```bash
   git clone https://github.com/devrajj/task-manager.git
```

- CREATE a .env file in the folder. Below are the keys that needs to be added in .env

- **.env values**

```bash
PORT=3002 //contains the port on which your server should run change or keep 3001
apiAccess=gvm+DLKi9NOcdFOAPH6QiuqXdIBiOdCkadqKQibZQWI= //contains apikey
mongodbUri=mongodb+srv://devrajsen14:password@cluster0.i45cv6t.mongodb.net/taskmanager //mongourl where data needs to be persisted (currently i have not given the password for security reason)
```

- On Backend window run npm i if you have cloned for the first time else ignore this step. This will install the dependencies used in backend.
- Once npm i is installed run npm run start (this will first do npm run build and then start server.ts file)
- To run unit test run command
  `npx jest`

## API Documentation

To explore and understand the API endpoints and functionality, refer to the [Postman API Documentation](https://documenter.getpostman.com/view/20988862/2sA2xmUVmy).

**Accessing Postman Documentation:**

- For hitting postman apis Go on Environments -> Globals and add a key API_ACCESS_TOKEN. The initial and current value will be your apiKey (gvm+DLKi9NOcdFOAPH6QiuqXdIBiOdCkadqKQibZQWI=)
