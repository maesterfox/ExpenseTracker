# GraphQL Expense Tracker App

![image](https://github.com/maesterfox/ExpenseTracker/assets/23552939/86550c59-5a39-4005-8e8a-a96f86ca5fd6)


## Features:

-   🌟 Tech stack: MERN (MongoDB, Express.js, React.js, Node.js) + Apollo GraphQL
-   📝 Learn type definitions and resolvers for defining GraphQL schema and data fetching logic
-   🔄 Mutations for modifying data in the GraphQL API and establishing graph relations
-   🎃 Authentication with Passport.js and MongoDB session store
-   🚀 Global state management with Apollo Client
-   🐞 Error handling both on the server and on the client
-   ⭐ Deployment made easy with a platform called Render
-   👾 Cron jobs for scheduled tasks and automation
-   ⏳ And much more!

### Detailed Features and Implementation

1. **MERN + Apollo GraphQL Tech Stack**:
   - Utilizes MongoDB for database solutions, Express.js for server-side logic, React.js for the frontend, and Node.js for the server environment.
   - Apollo GraphQL serves as a bridge between the MongoDB backend and the React frontend, facilitating effective queries and data mutations.

2. **GraphQL Schema and Resolvers**:
   - GraphQL schemas define the structure of data (type definitions) and the techniques for retrieving it (resolvers).
   - Type definitions for entities like `User` and `Transaction` and resolvers handle the API's request-response cycle.

3. **Data Mutations and Graph Relations**:
   - GraphQL mutations modify data (e.g., adding, updating, and deleting transactions).
   - Establishes relationships in the data graph, such as linking users to their transactions, enhancing the relational data model capabilities of MongoDB.

4. **Authentication System**:
   - Implements user authentication using Passport.js.
   - Manages sessions with a MongoDB session store, ensuring a secure and persistent user login state across sessions.

5. **Global State Management**:
   - Apollo Client manages global state for React applications, centralizing the state management and making state updates in response to GraphQL mutations.

6. **Error Handling**:
   - Robust error handling mechanisms are in place to handle and report errors both on the server side with Node.js and Express.js, and on the client side with Apollo Client in React.

7. **Deployment with Render**:
   - The entire application is deployable using Render, a service that simplifies the deployment process and offers automated deployments, rollbacks, and scaling.

8. **Cron Jobs**:
   - Utilizes cron jobs for automated tasks, such as keeping the server active to prevent downtime or performing regular data updates and backups.

This application not only provides a robust platform for managing financial transactions but also serves as a practical learning tool for understanding the integration of various technologies in a full-stack environment. Each component of the stack is leveraged to ensure a seamless, efficient, and scalable application.

### Setup .env file

```js
MONGO_URI=...
SESSION_SECRET=...
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
