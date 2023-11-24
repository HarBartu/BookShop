import { signJWT, verifyJWT } from "../../utils/jwt.utils.mjs";

export function deserializeUser(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  if (payload) {
    req.user = payload;
    return next();
  }

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }
  const newAccessToken = signJWT(
    { email: refresh.email, role: refresh.role },
    "30s"
  );

  res.cookie("accessToken", newAccessToken, {
    maxAge: 300000,
    httpOnly: true,
  });

  req.user = verifyJWT(newAccessToken).payload;

  return next();
}
