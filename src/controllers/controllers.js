/* eslint-disable space-before-function-paren */
const { isMyself } = require("../filters/auth");

function controller(fun) {
  return async (req, res, next) => {
    const needQuery = req.method === "GET" || req.method === "DELETE";
    try {
      res.json(await fun(needQuery ? req.query : req.body));
    } catch (err) {
      next(err);
    }
  };
}

async function protectedController(fun) {
  return async (req, res, next) => {
    const isGet = req.method === "GET";
    try {
      await isMyself(req, isGet ? req.query.userId : req.body.userId);
      await controller(req, res, next, fun);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  controller,
  protectedController,
};
