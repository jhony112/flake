import { FooBar } from "../models";
import { FooBarAttributes } from "../models/foobar.model";
import { paginateOptions } from "../utils/database";
import { abortIf } from "../utils/request/ApiResponder";
import { Request } from "express";
import httpStatus from "http-status";
import { Op, WhereOptions } from "sequelize";
import { generateChars } from "../utils/security/randomstring";

const create = async (req: Request) => {
  const body: Pick<FooBarAttributes, "name" | "slug" | "description"> = req.body;
  body.slug = body.slug || generateChars(9);

  return FooBar.create(body);
};

const update = async (req: Request) => {
  const { slug } = req.params;
  const body = req.body;

  const foobar = await findById(slug);

  Object.assign(foobar, body);
  await foobar.save();
  return foobar.reload();
};

const findById = async (id: string) => {
  const foobar = await FooBar.findOne({ where: { [Op.or]: [{ id }, { slug: id }] } });

  abortIf(!foobar, httpStatus.NOT_FOUND, "No foobar found");
  return foobar!;
};

const findAll = async (req: Request) => {
  const { slug, search_query } = req.query as any;
  const { limit, offset } = paginateOptions(req);
  const where: WhereOptions<FooBarAttributes> = {};

  if (slug != null) {
    where.slug = slug;
  }

  if (search_query) {
    where.name = { [Op.iLike]: `%${search_query}%` } as any;
  }
  const foobars = await FooBar.findAndCountAll({ where, limit, offset });
  return {
    items: foobars.rows,
    total: foobars.count,
  };
};

export default {
  create,
  update,
  findById,
  findAll,
};
