export function requireUser(permissions) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    if (!permissions.includes(req.user.role)) {
        return res.status(403).send("Forbidden");
    }

    return next();
  };
}
