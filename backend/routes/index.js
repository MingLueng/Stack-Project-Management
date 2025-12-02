import express from "express";
import authRoutes from './auth.js';
import workspaceRoutes from './workspace.js';
import projectRoutes from './project.js';
import taskRoutes from './task.js';
const routes = express.Router();

routes.use('/auth',authRoutes);
routes.use('/workspaces',workspaceRoutes);
routes.use('/projects',projectRoutes);
routes.use('/tasks', taskRoutes);
export default routes;