import { Sequelize } from "sequelize";
import { Model, Optional, DataTypes } from "sequelize";
import { ModelRegistry } from ".";
import { ModelStatic, SequelizeAttributes } from "../types/sequelize.types";

export interface TransactionAttributes {
 id: number;
  merchant_id: string;
  transaction_ref: string;
  transaction_status: number | null;
  transaction_type: number | null;
  preffered_channel: string | null;
  transaction_amount: number;
  flat_charge: number | null;
  merchant_amount: number | null;
  spread_share: string;
  transaction_currency_id: string;
  initiate: string | null;
  access_token: string;
  email: string;
  gateway_transaction_ref: string | null;
  rrn: string | null;
  bearer: number | null;
  recurring: string | null;
  merchant_name: string | null;
  merchant_business_name: string | null;
  merchant_email: string | null;
  transaction_memo: string | null;
  webhook_url: string | null;
  callback_url: string | null;
  created_at: Date | null;
  modified_at: Date | null;
  merchant_settlement_details: string | null;
  meta: string | null;
  transaction_response: string | null;
  is_suspicious: boolean | null;
  transaction_source: number | null;
  is_refund: boolean | null;
  transaction_payment_id: bigint | null;
  transaction_gateway_id: bigint | null;
  customer_email: string | null;
  customer_name: string | null;
  meta_data: string | null;
  customer_transaction_response: string | null;
  inserted_at: Date | null;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "inserted_at"> {}

export interface TransactionInstance
  extends Model<TransactionAttributes, TransactionCreationAttributes>,
      TransactionAttributes {}

//--> Model attributes
export const TransactionModelAttributes: SequelizeAttributes<TransactionAttributes> = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  merchant_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transaction_ref: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transaction_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  transaction_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  preffered_channel: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  transaction_amount: {
    type: DataTypes.DOUBLE(18),
    allowNull: false,
  },
  flat_charge: {
    type: DataTypes.DOUBLE(18),
    allowNull: true,
  },
  merchant_amount: {
    type: DataTypes.DOUBLE(18),
    allowNull: true,
  },
  spread_share: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transaction_currency_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  initiate: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gateway_transaction_ref: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rrn: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bearer: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  recurring: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  merchant_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  merchant_business_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  merchant_email: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  transaction_memo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  webhook_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  callback_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE(3),
    allowNull: true,
  },
  modified_at: {
    type: DataTypes.DATE(3),
    allowNull: true,
  },
  merchant_settlement_details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  meta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  transaction_response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_suspicious: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  transaction_source: {
    type: DataTypes.NUMBER,
    allowNull: true,
    defaultValue: 0,
  },
  is_refund: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  transaction_payment_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  transaction_gateway_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  meta_data: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  customer_transaction_response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  inserted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  }
};
// --> Factory....
export function TransactionFactory(sequelize: Sequelize) {
  const Transaction = <ModelStatic<TransactionInstance>>sequelize.define("Transaction", TransactionModelAttributes, {
    tableName: "transactions",
    underscored:true,
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

  Transaction.associate = function (models: ModelRegistry) {
    const { FooBar } = models;

    // FooBar.hasMany(models.Product, {
    //   as: "products",
    //   foreignKey: "brand_id",
    //   sourceKey: "brand_id",
    // });
  };

  Transaction.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
  };

  return Transaction;
}
