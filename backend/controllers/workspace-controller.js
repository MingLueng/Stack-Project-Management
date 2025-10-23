import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Workspace from'../models/workspace.js';
import Project from '../models/project.js'
import Task from '../models/task.js';
export const createWorkspace = async(req,res)=>{

   try {
    const {name,description,color} = req.body;

    const workspace = await Workspace.create({
        name,
        color,
        description,
        owner:req.user._id,
        members: [
            {
                user:req.user._id,
                role:"owner",
                joinedAt: new Date(),
            }
        ]
    });

    res.status(201).json({ status: true, message: "Workspace created successfully", workspace});

    } catch (error) {

        return res.status(500).json({ status: false, message: "Internal server error"});
    }
    
}

export const getWorkspaces = async(req, res)=>{
    try {
        const workspaces = await Workspace.find({"members.user": req.user._id}).sort({createdAt: -1}); // tìm những workspace mà user hiện tại là thành viên
        return res.status(200).json({status: true, message:"Workspace fetched successfully", workspaces});

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: "Internal server error"});
    }
}

export const getWorkspaceDetails = async(req, res)=>{
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace
        .findById({_id: workspaceId})
        .populate("members.user","name email profilePicture");
        if (!workspace){
            return res.status(404).json({status:false, message: "Workspace not found"});
        }
        return res.status(200).json({status:true, message: "Workspace detail is successfuly",workspace});

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: "Internal server error"});
    }
}

export const getWorkspaceProjects = async(req, res)=>{
      try {
        const { workspaceId } = req.params;

         const workspace = await Workspace.findOne({_id: workspaceId,"members.user":req.user._id})
         .populate("members.user","name email profilePicture");
        if (!workspace){
            return res.status(404).json({status:false, message: "Workspace not found"});
        }
        // Chỉ lấy các project thuộc về workspace có _id = workspaceId.
        // Loại bỏ các project đã bị archive (ẩn, không hoạt động).
        // $in kiểm tra xem req.user._id có nằm trong mảng members của project hay không.
        // Chỉ lấy những project mà người dùng hiện tại là thành viên.
        const projects = await Project.find({
            workspace: workspaceId,
            isArchived:false,
            members: { $elemMatch: { user: req.user._id }},
        })
        .populate("tasks","status") // đảm bảo model tồn tại
        .sort({createdAt: -1}); 
        return res.status(200).json({status:true, message: "Workspace detail is successfuly",projects,workspace});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: "Internal server error"});
    }
}
     







