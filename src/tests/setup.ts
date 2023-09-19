// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { Application, Express } from 'express';
// import supertest from 'supertest';
// import app from '../app';

// let api: supertest.SuperTest<supertest.Test>;
// let server: Express | Application | any;

// beforeAll(async () => {
//   // Start an in-memory MongoDB server
//   const mongo = await MongoMemoryServer.create();
//   const mongoUri = mongo.getUri();

//   // Connect to the in-memory database
//   await mongoose.connect(mongoUri, {});

//   // Start the application server
//   server = app.listen(3000);

//   // Set up Supertest
//   api = supertest(server);
// });

// afterAll(async () => {
//   // Close the database connection
//   await mongoose.connection.close();

//   // Stop the application server
//   await server.close();
// });

// export { api };
