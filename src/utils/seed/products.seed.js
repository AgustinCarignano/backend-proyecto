import { faker } from "@faker-js/faker";
import productsService from "../../services/products.service.js";

function generateProduct() {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.commerce.price()),
    thumbnail: [faker.image.url()],
    code: faker.location.zipCode(),
    stock: faker.number.int(300),
    status: faker.helpers.maybe(() => 1, { probability: 0.2 }) || 0,
    category: faker.commerce.department(),
    owner: faker.helpers.maybe(() => "admin", { probability: 0.5 }),
  };
}

export async function seedProducts(quantity, emailList) {
  for (let i = 0; i < quantity; i++) {
    const index = Math.round(Math.random() * (emailList.length - 1));
    const product = generateProduct();
    product.owner = product.owner ? product.owner : emailList[index];
    product.status = product.status === 0;
    await productsService.addProduct(product);
  }
}
