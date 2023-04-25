//import usersDAO from "../persistence/DAOs/usersDAO/usersMongo.js";
import usersRepository from "../persistence/repositories/users.repository.js";
import cartsDAO from "../persistence/DAOs/cartsDAO/cartsMongo.js";

class UsersService {
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
}

export default new UsersService();
