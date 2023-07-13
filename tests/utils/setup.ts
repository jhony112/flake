// See: https://jestjs.io/docs/configuration#setupfilesafterenv-array

// Prevent NODE_ENV from being override by something else. This is important
// because database config for integration testing is relying on this value.
process.env.NODE_ENV = "test";

// ---> THIS FILE RUNS ONLY ONCE
export default async () => {
  // await sequelize
  //   .sync({ force: true, alter: true })
  //   .catch((e) => {
  //     console.log(e);
  //     process.exit(1);
  //   })
  //   .then((r) => console.log("db connected"));
};
