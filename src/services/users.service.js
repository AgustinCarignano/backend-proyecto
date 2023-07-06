import usersRepository from "../persistence/repositories/users.repository.js";
import cartsDAO from "../persistence/DAOs/cartsDAO/cartsMongo.js";
import config from "../config.js";
import productsService from "./products.service.js";
import fs from "fs";

class UsersService {
  async getAllUsers() {
    try {
      const users = usersRepository.getAllUsers();
      return users;
    } catch (error) {
      return error;
    }
  }
  async addUser(user) {
    try {
      const { _id } = await cartsDAO.createCart();
      const newUser = await usersRepository.addUser({ ...user, cart: _id });
      return newUser;
    } catch (error) {
      return error;
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await usersRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      return error;
    }
  }
  async getUserById(id) {
    try {
      const user = await usersRepository.getUserById(id);
      return user;
    } catch (error) {
      return error;
    }
  }
  async validateUser(email, password) {
    try {
      const user = await usersRepository.validateUser(email, password);
      return user;
    } catch (error) {
      return error;
    }
  }
  async updateUser(email, obj) {
    try {
      const user = await usersRepository.updateUser(email, obj);
      return user;
    } catch (error) {
      return error;
    }
  }
  async updateUserWithId(uid, obj) {
    try {
      const user = await usersRepository.updateUserWithId(uid, obj);
      return user;
    } catch (error) {
      return error;
    }
  }
  async deleteUser(uid) {
    const user = await usersRepository.deleteUser(uid);
    await cartsDAO.deleteCarts([user.cart]);
    if (user.role === "premium") {
      await productsService.transferProductOwner([user.email]);
    }
    if (user.documents.length !== 0) {
      user.documents.forEach((doc) => {
        fs.unlinkSync(doc.reference);
      });
    }
    return user;
  }
  async deleteInactiveUsers() {
    const today = new Date().getTime();
    const users = await usersRepository.getAllUsers();
    const inactiveUserIds = [];
    const inactiveUserMails = [];
    const inactiveUserCarts = [];
    const ownerUsers = [];
    for (let i = 0; i < users.length; i++) {
      if (!users[i].last_connection) continue;
      const lastConn = users[i].last_connection.getTime();
      if (today - lastConn > 60000 * config.userInactiveTime) {
        inactiveUserIds.push(users[i].id);
        inactiveUserMails.push(users[i].email);
        inactiveUserCarts.push(users[i].cart);
        if (users[i].role === "premium") {
          ownerUsers.push(users[i].email);
        }
        if (users[i].documents.length !== 0) {
          users[i].documents.forEach((doc) => {
            fs.unlinkSync(doc.reference);
          });
        }
      }
    }
    await productsService.transferProductOwner(ownerUsers);
    const { acknowledged } = await usersRepository.deleteCounts(
      inactiveUserIds
    );
    await cartsDAO.deleteCarts(inactiveUserCarts);
    return { deleted: acknowledged, users: inactiveUserMails };
  }
}

export default new UsersService();
