export default class UserResDTO {
  constructor(user) {
    this.fullName = `${user.first_name} ${user.last_name}`;
    this.id = user._id.toString();
    this.email = user.email;
    this.role = user.role;
    this.cart = user.cart.toString();
    this.documents = user.documents;
    this.last_connection = user.last_connection;
  }
}
