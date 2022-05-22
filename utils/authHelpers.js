import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../models/auth.js";
import dotenv from "dotenv";
import { notAuthorized } from "./serverResponse.js";

const dotCon = dotenv.config({ path: "configure.env" });

export const isThisAdmin = (req, res, next) => {
  try {
    const {
      user: { isAdmin },
    } = req;
    if (!isAdmin) {
      return notAuthorized(res, { error: "Token Not Found" });
    }
    next();
  } catch (error) {
    res.status(400).send({ error: "Token Not Found" });
  }
};
export const passwordHasher = (password) => {
  const salt = bcrypt.genSaltSync(5);
  const hashedPassowrd = bcrypt.hashSync(password, salt);
  return hashedPassowrd;
};

// creating token for sending on front end
export const tokenGenerator = (user) => {
  const data = {
    userData: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      rollNo: user.rollNo,
    },
  };
  return jwt.sign(data, "Pakistan");
};

// token extractor or token checker
export const tokenExtractor = (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(400).send({ error: "Token Not Found" });
    }
    const decodeData = jwt.verify(token, "Pakistan");
    req.user = decodeData.userData;
    next();
  } catch (error) {
    res.status(400).send({ error: "Token Not Found" });
  }
};

// if user exist or not
export const isUserExist = async (res, email) => {
  const user = await Auth.findOne({ email });
  if (!user) {
    return notAuthorized(res);
  }
  return user;
};
