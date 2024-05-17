import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import path from "path";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";
import job from "./cron.js";

// Load environment variables
dotenv.config();

// Log environment variables for debugging
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

// Configure Passport
configurePassport();

// Start cron job
job.start();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

// Configure session store
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (err) => console.log("Session store error:", err));

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configure CORS
const allowedOrigins = [
  "https://expense-tracker-xi-seven.vercel.app",
  "http://localhost:5173", // Ensure this is the correct port for your local development server
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
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

// Start the Apollo Server
const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs: mergedTypeDefs,
      resolvers: mergedResolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }),
      })
    );

    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    });

    await connectDB();
    httpServer.listen({ port: 4000 }, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

export default startServer();
