import Joi from "joi";

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string(),
    description: Joi.string(),
  }),
};
const update = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
  }),
};
const findById = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};
const findAll = {
  params: Joi.object().keys({}),
  body: Joi.object().keys({}),
  query: Joi.object().keys({
    search_query: Joi.string(),
    page: Joi.number().min(1),
    perPage: Joi.number().min(5).max(200),
  }),
};

export default {
  create,
  update,
  findById,
  findAll,
};
