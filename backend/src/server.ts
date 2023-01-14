import app from "./app";
import getServerPort from "./utils/getServerPort";


const server = app;

const port = getServerPort();

server.listen(port, () => {
  console.log(
    `Server up and running, listening on http://localhost:${port}`
  );
});

export default server;
