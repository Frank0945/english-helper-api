/* eslint-disable space-before-function-paren */

function controller(fun, useReqSessionUserId = true) {
  return async (req, res, next) => {
    const needQuery = req.method === "GET" || req.method === "DELETE";

    try {
      if (useReqSessionUserId) {
        if (!req.session.passport || !req.session.passport.user.userId) {
          throw new Error("Unauthorized");
        }
      }

      res.json(
        await fun(
          needQuery ? req.query : req.body,
          useReqSessionUserId ? req.session.passport.user.userId : "1",
        ),
      );
    } catch (err) {
      if (err.message === "Unauthorized") {
        return res.status(401).json({ error: err.message });
      }
      next(err);
    }
  };
}

module.exports = {
  controller,
};
