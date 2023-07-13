import { Request } from "express";
import { SequelizeModel } from "../types/sequelize.types";

const getFillable = (model: SequelizeModel, exclusions: string[] = []) => {
  return Object.keys(model.rawAttributes).filter((s) => !exclusions.includes(s));
};

const paginateOptions = (req: Request) => {
  const page = (req.query.page || 1) as number;
  const perPage = (req.query.perPage || 12) as number;
  return {
    limit: perPage,
    offset: (page - 1) * perPage,
  };
};

export { getFillable, paginateOptions };
