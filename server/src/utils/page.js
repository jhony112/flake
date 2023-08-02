const paginateOptions = (req) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 12;
    return {
        limit: perPage,
        offset: (page - 1) * perPage,
    };
};

module.exports = { paginateOptions };
