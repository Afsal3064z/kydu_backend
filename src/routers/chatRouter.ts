import { Router } from 'express';
import isLoggedIn from '../middlewares/authMiddleware.js';
import {validateBody, validateParams, validateQuery} from '../middlewares/validateSchema.js';
import { GetChat, ListChats, SendMessageToChat } from '../controllers/chatController.js';
import { getChatParamsSchema } from '../schemas/chat/getChatSchemas.js';
import { postChatBodySchema, postChatParamsSchema } from '../schemas/chat/postChatSchemas.js';


const router = Router();

router.use(isLoggedIn);

router.get("/", ListChats);

router.get("/:senderId/:receiverId", validateParams(getChatParamsSchema), GetChat);
router.post("/:senderId/:receiverId", validateParams(postChatParamsSchema), validateBody(postChatBodySchema), SendMessageToChat);
// router.delete("/:senderId/:receiverId", validateParams(getChatParamsSchema), GetChat);

export default router;