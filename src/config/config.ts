import dotenv from "dotenv";

dotenv.config();

export const configs = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    ENVIRONMENT: process.env.ENVIRONMENT,

    // DB_TEST_URL: process.env.DB_TEST_URL || "",
    DB_DEV_URL: process.env.DB_DEV_URL || "",

    JWT_SECRET: process.env.JWT_SECRET || "",

    EMAIL_HOST: process.env.EMAIL_HOST || "",
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",

    FRONTEND_URL: process.env.FRONTEND_URL || "",

    // CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",
};

export default configs;
