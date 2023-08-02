const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().default('development'),
        PORT: Joi.number().default(9001),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const flakeConfig = require('../../flake.config');

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    HTTPS: false,
    AWS_REGION: envVars.AWS_REGION,
    AWS_ACCOUNT_ID: envVars.AWS_ACCOUNT_ID,
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
    SQS_QUEUE_MAX_MESSAGES: envVars.SQS_QUEUE_MAX_MESSAGES,
    SQS_QUEUE_WAIT_TIME: envVars.SQS_QUEUE_WAIT_TIME,
    SQS_VISIBILITY_TIMEOUT: envVars.SQS_VISIBILITY_TIMEOUT,
    flake: flakeConfig,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10,
    },
};
