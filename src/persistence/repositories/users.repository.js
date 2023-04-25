import UserReqDTO from "../DTOs/usersDTO/usersReq.dto.js";
import UserResDTO from "../DTOs/usersDTO/usersRes.dto.js";
import usersDAO from "../DAOs/usersDAO/usersMongo.js";
import { compareHashedData } from "../../utils/bcrypt.utils.js";

class UserRepository {
  constructor() {
    this.dao = usersDAO;
  }
  async addUser(user) {
    const userDB = new UserReqDTO(user);
    const userDAO = await this.dao.addUser(userDB);
    const userRes = new UserResDTO(userDAO);
    return userRes;
  }
  async getUserByEmail(email) {
    const userDAO = await this.dao.getUserByEmail(email);
    if (userDAO) return new UserResDTO(userDAO);
  }
  async getUserById(uid) {
    const userDAO = await this.dao.getUserById(uid);
    const userRes = new UserResDTO(userDAO);
    return userRes;
  }
  async validateUser(email, password) {
    try {
      const userDAO = await this.dao.getUserByEmail(email);
      const isValid = await compareHashedData(password, userDAO.password);
      if (isValid) return new UserResDTO(userDAO);
      else throw new Error("Incorrect password");
    } catch (error) {
      return error;
    }
  }
}

export default new UserRepository();
