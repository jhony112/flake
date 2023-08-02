const axois = require('axios');

const sendHttpRequest = async (url, payload, extra = {}) => {
    const { data, headers } = payload;
    try {
        const result = await axois.request({
            method: payload.method || 'POST',
            url,
            data,
            headers,
            ...extra,
        });
        return { success: true, response: result };
    } catch (e) {
        // console.log(e);
        throw e;
        // return { success: false, message: e.message };
    }
};
module.exports = { sendHttpRequest };
