import { hashSync } from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

/**
 * Genera una lista de usuarios falsos.
 * @param {number} count - Cantidad de usuarios a generar
 * @returns {Array<Object>} Array de objetos usuario con formato Mongo
 */
function generateMockUsers(count = 1) {
  const users = [];
  const plainPassword = 'coder123';
  const hashed = hashSync(plainPassword, 10);

  for (let i = 0; i < count; i++) {
    users.push({
      _id: new Types.ObjectId(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: hashed,
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: []
    });
  }
  return users;
}

export default generateMockUsers;
