import express from 'express';
import { protectRoute } from '../middleware/auth.Middleware.js';
import { getUsersForSidebar } from '../controllers/message.controller.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar)

//this is a more specific route using /send/:id thats why it comes before just /:id route 
router.post("/send/:id", protectRoute, sendMessage) // send message

// if we use this before then it will steal all the routes with /:id parameter
router.get("/:id", protectRoute, getMessages) // get the user by id

export default router;