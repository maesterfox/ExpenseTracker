import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

import job from "./cron.js";

dotenv.config();
configurePassport();

job.start();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log("Session store error:", err)); // Error handling for the store

app.use(
  session({
    secret: process.env.SESSION_SECRET, // This is used to sign the session ID cookie
    resave: false, // This option specifies whether to save the session to the store on every request
    saveUninitialized: false, // Option specifies whether to save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, // This option prevents the Cross-Site Scripting (XSS) attacks
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
  "https://expense-tracker-xi-seven.vercel.app",
  "https://exptrack.davidfoxdev.co.uk",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs: mergedTypeDefs,
      resolvers: mergedResolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    // Ensure we wait for our server to start
    await server.start();

    // Set up our Express middleware to handle CORS, body parsing,
    // and our expressMiddleware function.
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }),
      })
    );

    // Serve static files from the frontend build directory
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Fallback to index.html for all other routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    });

    // Start the server and connect to the database
    await connectDB();
    httpServer.listen({ port: 4000 }, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
