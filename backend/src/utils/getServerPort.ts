import configs from "../config/config";

export default () => {
  const environment = configs.ENVIRONMENT;

  switch (environment) {
    case "production":
      return configs.PORT;
    case "development":
      return 3000;
    case "test":
      return 3001;
    default:
      return configs.PORT;
  }
};