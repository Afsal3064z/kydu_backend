import { Router } from 'express';
import { GetUserProfile, PostLoginUser, PostSignupUser } from '../controllers/authController.js';
import isLoggedIn from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateSchema.js';
import { postSignupSchema } from '../schemas/users/postSignupSchemas.js';
import { postLoginSchema } from '../schemas/users/postLoginSchemas.js';

const router = Router();

router.post("/signup", validateBody(postSignupSchema), PostSignupUser);
router.post("/login", validateBody(postLoginSchema), PostLoginUser);
router.get("/profile", isLoggedIn, GetUserProfile);
// router.post("/register", PostRegisterRunner);
// router.get("/logout", GetLogoutUser);

export default router; 