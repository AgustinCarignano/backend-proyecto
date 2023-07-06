import { logger } from "../winston.js";
import { seedProducts } from "./products.seed.js";
import { seedUsers } from "./users.seed.js";
import "../../persistence/MongoDB/configMongo.js";
import "../../config.js";

async function main() {
  const users = await seedUsers(10);
  const emailOwners = users
    .filter((user) => user.role === "premium")
    .map((owner) => owner.email);
  await seedProducts(30, emailOwners);
}

try {
  await main();
  logger.info("Done!");
} catch (error) {
  logger.error(error.message);
} finally {
  process.exit();
}
