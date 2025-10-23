import express from 'express';
import  authMiddleware  from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import {projectSchema} from "../libs/validate-schema.js";
import { createProject } from '../controllers/project-controller.js';

const router = express.Router();

router.post("/:workspaceId/create-project",authMiddleware,validateRequest({ body: projectSchema }),createProject);

   
export default router;