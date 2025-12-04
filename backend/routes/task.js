import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { achievedTask, createTask, watchTask } from "../controllers/task-controller.js";
import { addSubTask } from "../controllers/task-controller.js";
const router = express.Router();
router.post(
  "/:projectId/create-task",
  authMiddleware,
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
    body: taskSchema,
  }),
  createTask
);
router.post(
  "/:taskId/add-subtask",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  addSubTask
);

// router.post(
//   "/:taskId/add-comment",
//   authMiddleware,
//   validateRequest({
//     params: z.object({ taskId:z.string() }),
//     body: z.object({ text: z.string() }),
//   }),
//   addComment
// );

router.post(
  "/:taskId/watch",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  watchTask
)
router.post(
  "/:taskId/achieved",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  achievedTask
)
export default router;