/* eslint-disable space-before-function-paren */

function controller(fun, useReqSessionUserId = true) {
  return async (req, res, next) => {
    const needQuery = req.method === "GET" || req.method === "DELETE";
    try {
      res.json(
        await fun(
          needQuery ? req.query : req.body,
          useReqSessionUserId ? req.session.passport.user.userId : "1"
        )
      );
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  controller,
};
