import { Request, Response } from "express";
import boobarService from "../service/foobar.service";
import { successResponse } from "../utils/request/ApiResponder";

const create = async (req: Request, res: Response) => {
  const result = await boobarService.create(req);
  successResponse(res, result);
};
const update = async (req: Request, res: Response) => {
  const result = await boobarService.update(req);
  successResponse(res, result);
};
const findById = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await boobarService.findById(slug);
  successResponse(res, result);
};
const findAll = async (req: Request, res: Response) => {
  const result = await boobarService.findAll(req);
  successResponse(res, result);
};

export default {
  create,
  update,
  findById,
  findAll,
};
