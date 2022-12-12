import express from 'express';
const router = express.Router()
import {getUser, getUserFriends, addRemoveFriend} from '../controllers/usersController.js';
import {verifyToken} from '../middleware/authMiddleware.js';
/* Read */
router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getUserFriends)
/* Update */
router.patch('/:id/:friendId', verifyToken, addRemoveFriend)

export default router