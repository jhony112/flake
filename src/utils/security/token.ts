import moment from "moment";
import jwt from "jsonwebtoken";
import { tokenTypes } from "../../config/tokens";
import config from "../../config/config";

const TOKEN_TYPES = {
  USER: "user",
  ADMIN: "admin",
  SERVICE: "service",
};

/**
 * Generate token
 * @param {Object} data
 * @param {Moment} expires
 * @param type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (data, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: data,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param data
 * @param roles
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (data, roles = {}) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpires, "minutes");
  const accessToken = generateToken({ ...data, roles }, accessTokenExpires, tokenTypes.ACCESS);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

const generateServiceAuthToken = async (roles = {}) => {
  return generateAuthTokens({ name: process.env.NAME, type: TOKEN_TYPES.SERVICE }, roles);
};

const generateUserAuthToken = async (user, roles = {}) => {
  return generateAuthTokens({ id: user.id, name: user.first_name, type: TOKEN_TYPES.USER }, roles);
};

const generateAdminAuthToken = async (admin, roles = {}) => {
  return generateAuthTokens(
    { id: admin.id, name: admin.first_name, type: TOKEN_TYPES.ADMIN },
    roles
  );
};

export {
  TOKEN_TYPES,
  generateToken,
  generateUserAuthToken,
  generateServiceAuthToken,
  generateAdminAuthToken,
};
