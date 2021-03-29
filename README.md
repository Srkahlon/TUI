## Requirements

- Node version - v10.19.0

## Installation

Use the package manager [npm] to install the dependencies.

```bash
npm install
```

## To Run the application

```bash
npm start
```
## To Run the tests

```bash
npm test
```

## Folder Structure

- The entry point of the application is the index.js file
- All other files are present in the src folder
- The config folder inside src contains configuration-related files globals.js.
- The controllers folder contains, repositoryController.js that contains the business logic to get the required repository details for the given userName.
- The routes are present in the src/routes/apiRoutes.js
- The middleware folder contains the repositoryMiddlerware.js, that has functions to check the incoming request headers and body