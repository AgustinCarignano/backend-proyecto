import { faker } from "@faker-js/faker";
import usersService from "../../services/users.service.js";

function generateUser() {
  let name = faker.person.firstName();
  let surname = faker.person.lastName();
  return {
    firstName: name,
    lastName: surname,
    age: faker.number.int({ min: 20, max: 60 }),
    email: faker.internet.email({ firstName: name, lastName: surname }),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(["premium", "user"]),
  };
}

export async function seedUsers(quantity) {
  const users = [];
  for (let i = 0; i < quantity; i++) {
    const user = generateUser();
    await usersService.addUser(user);
    users.push(user);
  }
  return users;
}
