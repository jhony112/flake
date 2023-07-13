import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().default("development"),
    REGION: Joi.string().default("eu-west-2"),
    PORT: Joi.number().default(8004),
    JWT_SECRET: Joi.string().description("JWT secret key").default("jwt-token-secret"),
    JWT_SECRET_ADMIN: Joi.string().description("JWT secret key").default("jwt-token-secret-admin"),
    JWT_SECRET_STORE_USER: Joi.string()
      .description("JWT secret key")
      .default("jwt-token-secret-store-user"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(90)
      .description("days after which refresh tokens expire"),
    DB_NAME: Joi.string().default("db-name"),
    DB_USERNAME: Joi.string().default("postgres"),
    DB_PASSWORD: Joi.string().default("1223"),
    DB_HOST: Joi.string().default("localhost"),
    DB_PORT: Joi.number().default(5432),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default Object.freeze({
  ...process.env,
  env: envVars.NODE_ENV,
  PORT: envVars.PORT,
  REGION: envVars.REGION,
  NODE_ENV: envVars.NODE_ENV,
  DB_NAME: envVars.DB_NAME,
  DB_USERNAME: envVars.DB_USERNAME,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_HOST: envVars.DB_HOST,
  DB_PORT: envVars.DB_PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpires: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpires: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
});
