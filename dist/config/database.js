"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
function getDatabaseURL(environment) {
    switch (environment) {
        //   case "production":
        //     return configs.DB_PRODUCTION_URL;
        case "development":
            return config_1.default.DB_DEV_URL;
        //   case "test":
        //     return configs.DB_TEST_URL;
        default:
            return config_1.default.DB_DEV_URL;
    }
}
const connectDatabase = () => {
    const databaseUrl = getDatabaseURL(config_1.default.ENVIRONMENT);
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default
        .connect(databaseUrl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    })
        .then(() => {
        console.log("Connected to DB 😊");
    })
        .catch((error) => {
        console.log(`${error.name}: ${error.message}`);
    });
};
exports.connectDatabase = connectDatabase;
