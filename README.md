# MySalaryApp

This is a web application that allows users to manage salary records. It provides functionality for creating, deleting, and retrieving salary records, as well as generating salary statistics by department.


## Stack

NodeJS
ExpressJS
PostgreSQL
Sequelize
pino for log
open api

```
DB NAME : myappDb
```


## Installation

1. Clone the repository using the following command:

   ```bash
   git clone https://github.com/khaleelkamar/mySalaryApp.git

2.Create a PostgreSQL database named "myappDb" to store the application data.

Navigate to the project directory:

 ```
 cd mySalaryApp

 ```

3.Install the project dependencies:

  ```
  npm install
  ```


  


## Usage

1.Start the application in development mode:

  ```
  npm run dev
  ```
  after successfully synchronizing the database, a success message will appear

2.Run the database migrations and seed data to set up the initial data:

  "Open a new terminal and simultaneously run the following commands in separate terminals or terminal tabs:"

   ```
   npx sequelize-cli db:seed:all
   ```

  This will start the server on http://localhost:3000.

  Open your web browser and visit http://localhost:3000 to access the application.

  You can also use a command-line tool like curl to make API requests. For example, to perform a login request:

  curl -X POST http://localhost:3000/api/v1/login -d '{"userName": "testUser", "password": "password"}' -H "Content-Type: application/json"

  Replace testUser with the desired username and password with the associated password.


## Testing
The project includes Mocha unit tests to ensure the correctness of the code. To run the tests, use the following command:

```
npm test
```

## Build
To compile the project for production deployment, use the following command:

```
npm run compile
```


