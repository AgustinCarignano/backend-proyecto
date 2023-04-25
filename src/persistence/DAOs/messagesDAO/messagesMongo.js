import { messagesModel } from "../../MongoDB/models/message.model.js";

class MessageMongo {
  constructor() {
    this.model = messagesModel;
  }
  async getMessages() {
    try {
      const messages = await this.model.find();
      return messages;
    } catch (error) {
      return error;
    }
  }
  async saveMessage(newMessage) {
    try {
      await this.model.create(newMessage);
      return this.getMessages();
    } catch (error) {
      return error;
    }
  }
  async cleanHistory() {
    try {
      await this.model.deleteMany();
      return this.getMessages();
    } catch (error) {
      return error;
    }
  }
}

export default new MessageMongo();
