"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
exports.default = () => {
    const environment = config_1.default.ENVIRONMENT;
    switch (environment) {
        case "production":
            return config_1.default.PORT;
        case "development":
            return 3000;
        case "test":
            return 3001;
        default:
            return config_1.default.PORT;
    }
};
