import { Dialect, Model, ModelOptions, Options } from "sequelize";
import config from "../../config/config";

interface DBStages {
  test: Options;
  local: Options;
  development: Options;
  production: Options;
}

const modelDefineptions: ModelOptions<Model<any, any>> | undefined = {
  timestamps: true,
  freezeTableName: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
  version: false,
};

const dbConfig = Object.freeze<DBStages>({
  test: {
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    dialect: "postgres" as Dialect,
    logging: false,
    port: Number(config.DB_PORT) || 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: modelDefineptions,
  },
  local: {
    database: config.DB_NAME!,
    username: config.DB_USERNAME!,
    password: config.DB_PASSWORD!,
    host: config.DB_HOST,
    dialect: "postgres" as Dialect,
    port: Number(config.DB_PORT) || 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: modelDefineptions,
  },
  development: {
    database: config.DB_NAME!,
    username: config.DB_USERNAME!,
    password: config.DB_PASSWORD!,
    host: config.DB_HOST,
    dialect: "postgres" as Dialect,
    port: Number(config.DB_PORT) || 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: modelDefineptions,
  },
  production: {
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: modelDefineptions,
  },
});

export = dbConfig;
