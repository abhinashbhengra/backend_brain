import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Profile router
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);

// News routes

router.get('/news', NewsController.index)
router.post('/news', authMiddleware,  NewsController.store)
router.get('/news/:id', NewsController.show)
router.put('/news', NewsController.update)
router.delete('/news', NewsController.destroy)

export default router;
