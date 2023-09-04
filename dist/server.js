"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const getServerPort_1 = __importDefault(require("./utils/getServerPort"));
const server = app_1.default;
const port = (0, getServerPort_1.default)();
server.listen(port, () => {
    console.log(`Server up and running, listening on http://localhost:${port}`);
});
exports.default = server;
