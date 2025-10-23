import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Project from '../models/project.js';
import Workspace from '../models/workspace.js';

export const createProject = async (req,res)=>{
    try {
        const { workspaceId } = req.params;
        const { title, description, status, startDate, dueDate,tags,members } = req.body;

        const workspace = await Workspace.findById(workspaceId);

        if(!workspace){
            return res.status(404).json({status:false, message: "Workspace not found"});
        }
        //.some(): dùng để kiểm tra xem trong mảng có phần tử nào thỏa điều kiện hay không.Nó trả về true hoặc false.
        const isMember = workspace.members.some((member)=> member.user.toString() === req.user._id.toString());

        if(!isMember){
            return res.status(403).json({status:false, message: "You are not a member of this workspace"});
        }
        const tagArray = tags ? tags.split(",") : [];
        const newProject  = await Project.create({
            title,
            description,
            status,
            startDate,
            dueDate,
            tags: tagArray,
            workspace: workspaceId,
            members,
            createdBy: req.user._id,

        });

             if (Array.isArray(workspace.projects)) {
            workspace.projects.push(newProject._id);
            await workspace.save();
            }

        return res.status(201).json({status:true, message: "Project created successfully", data:newProject});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ status:false, message:"Internal server error" });
    }
}
