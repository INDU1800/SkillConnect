import express from 'express';
import {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  getDashboardData,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendRequest);
router.get('/sent', protect, getSentRequests);
router.get('/received', protect, getReceivedRequests);
router.get('/dashboard', protect, getDashboardData);
router.put('/:id', protect, updateRequestStatus);

export default router;
