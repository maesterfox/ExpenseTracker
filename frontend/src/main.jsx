import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.jsx"; // corrected typo
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Determine the GraphQL server URI based on the environment
const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : "https://expense-tracker-ten-green.vercel.app/", // update with your actual EC2 public DNS
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>
);
