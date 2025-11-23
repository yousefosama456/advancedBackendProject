//api.mydomain/product?page=1&limit=10

module.exports = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || "createAt";
    const order = req.query.order === "desc" ? -1 : 1;

    const [results, total] = await Promise.all([
      model
        .find()
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit),
      model.countDocuments(),
    ]);
    res.paginatedResult = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResult: total,
      results,
    };
    next();
  } catch (err) {
    next(err);
  }
};
