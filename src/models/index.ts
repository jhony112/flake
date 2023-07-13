"use strict";
import { Sequelize } from "sequelize";
import dbConfig from "../database/config/db.config";
import config from "../config/config";
import pg from "pg";
import { FooBarFactory } from "./foobar.model";
import { isAssociatable } from "../types/sequelize.types";
pg.defaults.parseInt8 = true; //Convert Int returned as strings to Int...
// @ts-ignore
const database = dbConfig[config.env] || dbConfig.development;
const sequelize = new Sequelize(database.database, database.username, database.password, {
  ...database,
  dialect: database.dialect,
});

export const FooBar = FooBarFactory(sequelize);
//... Other Models

const models = {
  FooBar,
};

export type ModelRegistry = typeof models;

Object.values(models).forEach((model: any) => {
  if (isAssociatable<ModelRegistry>(model)) {
    model.associate(models);
  }
});

(async () => {
  // await sequelize.query(`ALTER USER ${database.username} SET timezone='Europe/London';`, {
  //   raw: true,
  //   type: QueryTypes.RAW,
  // });
  // await sequelize.sync({ force: true });
})();
export default sequelize;
