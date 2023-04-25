import { usersModel } from "../../MongoDB/models/users.model.js";

class UserMongo {
  async addUser(userObj) {
    try {
      const user = await usersModel.create(userObj);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  async getUserByEmail(userEmail) {
    const user = await usersModel.findOne({ email: userEmail }).lean();
    if (!user) {
      return;
    }
    return user;
  }
  async getUserById(uid) {
    try {
      const user = await usersModel.findById(uid).lean();
      if (!user) throw new Error("user does not exist");
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserMongo();
