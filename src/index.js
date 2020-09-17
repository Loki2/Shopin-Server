import express from 'express';
import mongoose from 'mongoose';
import server from './server';
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const { APP_PORT, DB_URI } = process.env


const createServer = async () => {
  try {
    //connection to database
    await mongoose.connect( `${DB_URI}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    server.applyMiddleware({app})

    app.listen({ port: APP_PORT }, () => 
      console.log(`Server is Start http://localhost:${APP_PORT}${server.graphqlPath}`)
    )
  } catch (error) {
    console.log(error)
  }
}

createServer()

