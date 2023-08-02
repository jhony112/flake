const Joi = require('joi');

module.exports = {
    messageValidator: {
        url: Joi.string().required(),
        request_payload: Joi.object({
            method: Joi.string().valid('POST', 'PUT', 'PATCH').required(),
            data: Joi.object().required(),
            headers: Joi.object().optional().allow('', null),
        }).required(),
        callback_url: Joi.string().optional().allow('', null),
        id: Joi.string().optional().allow('', null),
    },
};
