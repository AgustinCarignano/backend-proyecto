export default class UserReqDTO {
  constructor(user) {
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.email = user.email;
    this.age = user.age;
    this.password = user.password;
    this.cart = user.cart;
  }
}
