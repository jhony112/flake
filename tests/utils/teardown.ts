import sequelize from "../../src/models";

// ---> THIS FILE RUNS ONLY ONCE
export default async () => {
  await sequelize.close();
};
