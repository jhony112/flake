import { Sequelize } from "sequelize";
import { Model, Optional, DataTypes } from "sequelize";
import { ModelRegistry } from ".";
import { ModelStatic, SequelizeAttributes } from "../types/sequelize.types";

export interface FooBarAttributes {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface FooBarCreationAttributes extends Optional<FooBarAttributes, "id" | "description"> {}

export interface FooBarInstance
  extends Model<FooBarAttributes, FooBarCreationAttributes>,
    FooBarAttributes {}

//--> Model attributes
export const FooBarModelAttributes: SequelizeAttributes<FooBarAttributes> = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
};
// --> Factory....
export function FooBarFactory(sequelize: Sequelize) {
  const FooBar = <ModelStatic<FooBarInstance>>sequelize.define("FooBar", FooBarModelAttributes, {
    tableName: "FooBar",
    defaultScope: {
      order: [["created_at", "DESC"]],
    },
    scopes: {
      basic: {
        attributes: ["id", "name"],
      },
    },
    indexes: [
      {
        fields: ["slug"],
      },
    ],
  });

  FooBar.associate = function (models: ModelRegistry) {
    const { FooBar } = models;

    // FooBar.hasMany(models.Product, {
    //   as: "products",
    //   foreignKey: "brand_id",
    //   sourceKey: "brand_id",
    // });
  };

  FooBar.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
  };

  return FooBar;
}
