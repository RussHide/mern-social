import express from 'express';
const router = express.Router()
import {getFeedPosts, getUserPosts, likePost} from '../controllers/postsController.js';
import {verifyToken} from '../middleware/authMiddleware.js';
/* Read */
router.get('/', verifyToken, getFeedPosts)
router.get('/:userId/posts', verifyToken, getUserPosts)
/* Update */
router.patch('/:id/like', verifyToken, likePost)

export default router