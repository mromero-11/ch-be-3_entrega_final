import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

/**
 * Genera una lista de mascotas falsas.
 * @param {number} count - Cantidad de mascotas a generar
 * @returns {Array<Object>} Array de objetos mascota con formato Mongo
 */
function generateMockPets(count = 1) {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push({
      _id: new Types.ObjectId(),
      name: faker.animal.cat(),
      specie: faker.animal.type(),
      age: faker.number.int({ min: 1, max: 15 }),
      adopted: false,
      owner: null
    });
  }
  return pets;
}

export default generateMockPets;
