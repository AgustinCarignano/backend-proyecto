import { logger } from "../../../utils/winston.js";
import { usersModel } from "../../MongoDB/models/users.model.js";

class UserMongo {
  async getAllUsers() {
    try {
      const users = await usersModel.find().lean();
      return users;
    } catch (error) {
      return error;
    }
  }
  async addUser(userObj) {
    try {
      const user = await usersModel.create(userObj);
      return user;
    } catch (error) {
      logger.error(error);
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
  async updateUser(userEmail, obj) {
    try {
      const newUser = await usersModel.findOneAndUpdate(
        { email: userEmail },
        { ...obj },
        { new: true }
      );
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateUserWithId(uid, obj) {
    try {
      if (obj.id) delete obj.id;
      const newUser = await usersModel.findByIdAndUpdate(
        uid,
        { ...obj },
        { new: true }
      );
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteOneUser(uid) {
    const user = await usersModel.findByIdAndDelete(uid);
    return user;
  }
  async deleteManyUsers(userIds) {
    const users = await usersModel.deleteMany({ _id: userIds });
    return users;
  }
}

export default new UserMongo();
