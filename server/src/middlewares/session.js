import { jwtVerify } from "jose";
import { config } from "dotenv";
config();

export const userJWT = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) res.status(401).send({ error: "unauthorized" });
  const jwt = authorization.split(" ")[1];
  if (!jwt) res.status(401).send({ error: "unauthorized" });
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      jwt,
      encoder.encode(process.env.SECRET)
    );
    req.id = payload.id;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};
