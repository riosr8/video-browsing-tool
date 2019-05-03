# Video Browsing Tool

## Installation
Run the following commands to ensure all node modules are installed correctly.

**All commands should be executed from the project root.**

`npm run dev:install` : To install all node modules.

---

## Usage

To start the web application, use the command `docker-compose up`

This will bind the application components to the following ports:

* Client application runs on port `3000`
* Server application with api runs on port `5000`
* Mongo database runs on port `27017`
* The mock processing runs the background and only talks to the database.

### View the running application at http://localhost:3000/

---

## Testing

To run tests do the following:

1.  Export evironment variable: `export NODE_ENV=test`
2.  Start the Mongo daemon with `mongod`
3.   `npm run test`

In order to get the coverage report do the following:

**Client coverage**

1. cd into the `client` directory
2. `npm run test:coverage`

**Server coverage**

1. cd into the `server` directory
2. Export evironment variable: `export NODE_ENV=test`
3. Start the Mongo daemon with `mongod`
4. `npm run test:coverage`

You can find a generated coverage folder within each of the above directories.

---

## Authors
* Arun Kuchibotla 
* Bao Tran
* Diego Perez
* Jose Ipina
* Kevin Do
* Luis Flores
* Matthew Potter
* Raul Rios




