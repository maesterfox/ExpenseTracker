import startServer from "../backend/index.js";

export default async function handler(req, res) {
  const app = await startServer;
  app(req, res);
}
