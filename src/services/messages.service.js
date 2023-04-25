import messagesDAO from "../persistence/DAOs/messagesDAO/messagesMongo.js";

class MessageService {
  constructor() {
    this.dao = messagesDAO;
  }
  async getMessages() {
    try {
      return await this.dao.getMessages();
    } catch (error) {
      return error;
    }
  }
  async saveMessage(newMessage) {
    try {
      return this.dao.saveMessage(newMessage);
    } catch (error) {
      return error;
    }
  }
  async cleanHistory() {
    try {
      return await this.dao.cleanHistory();
    } catch (error) {
      return error;
    }
  }
}

export default new MessageService();
