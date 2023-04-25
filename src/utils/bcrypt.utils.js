import bcrypt from "bcrypt";
import config from "../config.js";

const SALT = parseInt(config.saltOrRound);

export const hashData = (data) =>
  bcrypt.hashSync(data, SALT, (err, hash) => {
    if (err) return err;
    return hash;
  });
//return bcrypt.hash(data, SALT);
export const compareHashedData = (data, hashedData) =>
  bcrypt.compare(data, hashedData);
