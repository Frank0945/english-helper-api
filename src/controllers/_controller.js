const { isMyself } = require("../filters/auth");

async function controller(req, res, next, fun) {
  try {
    res.json(await fun(req.body));
  } catch (err) {
    next(err);
  }
}

async function protectedController(req, res, next, fun) {
  try {
    await isMyself(req, req.body.user_id);
    await controller(req, res, next, fun);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  controller,
  protectedController,
};
