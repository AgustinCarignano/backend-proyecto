import { userModel } from "../models/users.model.js";

export class UserManager {
  async addUser(userObj) {
    try {
      const user = await userModel.create(userObj);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  async getUserByEmail(userEmail) {
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return;
    }
    return user;
  }
  async getUserById(uid) {
    try {
      const user = await userModel.findById(uid);
      if (!user) throw new Error("user does not exist");
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
