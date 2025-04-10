import express from 'express';
import { protectRoute } from '../middleware/auth.Middleware.js';
import { getUsersForSidebar } from '../controllers/message.controller.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages) // get the user by id

router.post("/send/:id", protectRoute, sendMessage) // send message


export default router;