import express from "express";
import authRoutes from './auth.js';
import workspaceRoutes from './workspace.js';
import projectRoutes from './project.js';
const routes = express.Router();

routes.use('/auth',authRoutes);

routes.use('/workspaces',workspaceRoutes);

routes.use('/projects',projectRoutes);

export default routes;