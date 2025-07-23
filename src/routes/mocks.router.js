import { Router } from 'express';
import generateMockPets from '../utils/mockingPets.js';
import generateMockUsers from '../utils/mockingUsers.js';
import { errorDictionary, ValidationError, DatabaseError } from '../utils/customErrors.js';
const router = Router();


// GET /api/mocks/mockingusers
router.get('/mockingusers', (req, res, next) => {
  try {
    const users = generateMockUsers(50);
    res.json(users);
  } catch (err) {
    next(new DatabaseError(errorDictionary.USER_REGISTRATION_FAILED.message, err));
  }
});

// POST /api/mocks/generateData
router.post('/generateData', async (req, res, next) => {
  try {
    const { users: userCount, pets: petCount } = req.body;
    if (!Number.isInteger(userCount) || !Number.isInteger(petCount)) {
      throw new ValidationError(errorDictionary.INVALID_MOCK_PARAMETERS.message);
    }

    const mockUsers = generateMockUsers(userCount);
    const mockPets  = generateMockPets(petCount);

    const { User } = require('../dao/models/User');
    const { Pet  } = require('../dao/models/Pet');

    await User.insertMany(mockUsers);
    await Pet.insertMany(mockPets);

    res.json({ insertedUsers: userCount, insertedPets: petCount });
  } catch (err) {
    if (err.name === 'ValidationError') return next(err);
    next(new DatabaseError(errorDictionary.DATA_GENERATION_FAILED.message, err));
  }
});

export default router;
