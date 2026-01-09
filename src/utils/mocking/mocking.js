import { faker } from "@faker-js/faker";

/**
 * Generates an array of mock products.
 * @param {number} count - Number of products to generate.
 */
export const generateMockProducts = (count) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.string.uuid(),
      price: parseFloat(
        faker.commerce.price({ min: 1000, max: 100000 })
      ),
      status: faker.datatype.boolean(),
      stock: faker.number.int({ min: 0, max: 100 }),
      category: faker.commerce.department(),
      thumbnail: faker.image.urlPicsumPhotos(),
    });
  }

  return products;
};

/**
 * Generates an array of mock users.
 * @param {number} count - Number of users to generate.
 */
export const generateMockUsers = (count) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
      cart: null,
    });
  }

  return users;
};