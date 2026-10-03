import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  addSkillToTeach,
  removeSkillToTeach,
  addSkillToLearn,
  removeSkillToLearn,
  discoverSkills,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/skills/discover', discoverSkills);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUserProfile);

// Skills management for logged in student
router.post('/skills/teach', protect, addSkillToTeach);
router.delete('/skills/teach/:skillId', protect, removeSkillToTeach);
router.post('/skills/learn', protect, addSkillToLearn);
router.delete('/skills/learn/:skillId', protect, removeSkillToLearn);

export default router;
