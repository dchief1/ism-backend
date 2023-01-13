import configs from "./config/config";
import app from "./app";
import express from "express";
import getServerPort from "./utils/getServerPort";
// import { config } from "process";


const server = app;

const port = getServerPort();

server.listen(port, () => {
  console.log(
    `Server up and running, listening on http://localhost:${port}`
  );
});

export default server;
