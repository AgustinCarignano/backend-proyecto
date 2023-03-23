import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const saltRounds = 10;

export const hashPassword = (password) =>
  bcrypt.hashSync(password, saltRounds, (err, hash) => {
    if (err) return err;
    return hash;
  });

export const comparePasswords = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const generateToken = (data) => {
  const token = jwt.sign({ data }, "mySecretKey", { expiresIn: "1d" });
  return token;
};
