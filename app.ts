import { askQuery } from './src/controllers/chat.controller';

import express from 'express';
const app = express();
import routes from './src/routes/api';
import auth from "./src/routes/auth"
import { AppDataSource } from './src/config/data-source';
import { DataSource } from 'typeorm';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger';
import chat from './src/routes/chat'
import cors from "cors";
import { Certificate } from './src/entity/certificate.entity';
import  certificate  from './src/routes/certificate';
import { rateLimit } from 'express-rate-limit'



const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for form data
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Swagger setup
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes setup
app.use('/api/auth', auth)
app.use('/api/chat', chat)
app.use('/api/certificate', certificate);


// Start server
const PORT = process.env.PORT || 3000

  AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

export default app;
