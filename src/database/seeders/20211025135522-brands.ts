import { QueryInterface } from "sequelize";

async function up(queryInterface: QueryInterface) {
  await queryInterface.bulkInsert(
    "FooBar",
    [
      {
        id: 1,
        name: "EXE Islands",
        slug: "H8K6QujMMEna",
        description:
          "Crossroad driver Incredible real-time white payment moratorium Steel Cheese virtual Louisiana Tools invoice proactive Avon Stream Markets Forward bypass Steel",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Florida Bedfordshire",
        slug: "csppSMbduays",
        description:
          "Cambridgeshire transition auxiliary deposit Bedfordshire Chief AI (Bouvetoya) software back-end Cheese override blockchains FooBaring system Borders index payment revolutionize redundant",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {}
  );
}

async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("FooBar", {}, {});
}

export default { up, down };
