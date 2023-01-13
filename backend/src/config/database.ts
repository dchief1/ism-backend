import mongoose from "mongoose";
import configs from "../config/config";

function getDatabaseURL(environment: any) {
    switch (environment) {
    //   case "production":
    //     return configs.DB_PRODUCTION_URL;
      case "development": 
        return configs.DB_DEV_URL;
    //   case "test":
    //     return configs.DB_TEST_URL;
      default:
        return configs.DB_DEV_URL;
    }
  }

  export const connectDatabase = () => {
    const databaseUrl = getDatabaseURL(configs.ENVIRONMENT)

    mongoose.set('strictQuery', false);

    mongoose
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
  }