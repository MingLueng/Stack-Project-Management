import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";


export const createTask = async (req, res) =>{
      try {
        const {projectId} = req.params;
        const {title, description, status, priority, dueDate, assignees } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
        return res.status(404).json({
            message: "Project not found",
        });
        }
        const workspace = await Workspace.findById(project.workspace);

        if (!workspace) {
        return res.status(404).json({message: "Workspace not found"});
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString());

        if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this workspace",
        });
        }
        const newTask = await Task.create({
                title,
                description,
                status,
                priority,
                dueDate,
                assignees,
                project: projectId,
                createdBy: req.user._id,
                });

            project.tasks.push(newTask._id);
                await project.save();
                res.status(201).json(newTask);
            }
            catch(error) {
                console.log(error);
                return res.status(500).json({message: "Internal server error",});
            }
}

export const getTaskById = async(req, res) =>{

    try {
    const {taskId} = req.params;

    const task = await Task.findById(taskId)
    .populate("assignees","name profilePicture")
    .populate("watchers","name profilePicture");

    if(!task){
        return res.status(404).json({message: "Task not found"});
    }

    const project = await Project.findById(task.project).populate("member.user","name profilePicture");

        return res.status(200).json({ task, project });
    }
    catch(error){
        return res.status(500).json({message: "Internal server error"});
    }
}

export const updateTaskTitle = async(req, res)=> {
    try {
        const {taskId} = req.params;
        const {title} = req.body;

        const task = await Task.findById(taskId);
    if(!task){
        return res.status(404).json({message: "Task not found"});
    }
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

    if(!isMember){
        return res.status(403).json({message:"You are not a member of this project"});
    }
    
        const oldTitle = task.title;
        task.title = title;
        await task.save();

        const activityData = {
            description:`Updated task title from "${oldTitle}" to "${title}"`
        }
        await recordActivity(
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_task", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);
    } catch (error) {
    
        return res.status(500).json({message: "Internal server error"});
    
    }
}

export const updateTaskDescription = async (req, res)=>{
    try {
        const {taskId} = req.params;
        const {description} = req.body;
    const task = await Task.findById(taskId);

    if(!task){
        return res.status(404).json({message: "Task not found"});
    }

    const project = await Project.findById(task.project);

    if(!project){
        return res.status(404).json({message: "Project not found"});
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

    if(!isMember){
        return res.status(403).json({message:"You are not a member of this project"});
    }

    const oldDescription = task.description.substring(0,50) + (task.description.length > 50 ? "..." : "");

    const newDescription = description.substring(0,50) + (description.length > 50 ? "..." : "")

    task.description = description;

    await task.save();

    const activityData = {
    description:`Updated task description from "${oldDescription}" to "${newDescription}"`
    }
    await recordActivity(
        req.user._id, // Ai làm hành động
        "Task",  // Loại hoạt động
        "updated_task", // Loại object
        taskId, // ID của task
        activityData // Dữ liệu thêm
    );
    res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }

}

export const updatedTaskStatus = async(req, res) => {
    try {
        const {taskId} = req.params;
        const {status} = req.body;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        const project = await Project.findById(task.project);

        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());

        if(!isMember){
            return res.status(403).json({message:"You are not a member of this project"});
        }

        const oldStatus = task.status;
        task.status = status;
        await task.save();

        const activityData = {
        description:`Updated task status from "${oldStatus}" to "${status}"`
        }
        await recordActivity(
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_task", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const updatedTaskAssignees = async(req,res) => {
    try {
        const {taskId} = req.params;
        const {assignees} = req.body;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        const project = await Project.findById(task.project);

        if(!project){
            return res.status(404).json({message: "Project not found"});
        }

        const isMember = project.members.some((member)=>member.user.toString() === req.user._id.toString());

        if(!isMember){
            return res.status(403).json({message: "You are not a member of this project"});
        }

        const oldAssignees = task.assignees;
        task.assignees = assignees;
        await task.save();

        const activityData = {
        description:`Updated task assignees from "${oldAssignees.length}" to "${assignees.length}"`
        }
        await recordActivity(
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_task", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const updatedTaskPriority = async(req,res) => {
    try {
        const {taskId} = req.params;
        const {priority} = req.body;

        const task = await Task.findById(taskId);

        if(!taskId){
            return res.status(404).json({message: "Task not found"});
        }
            const project = await Project.findById(task.project);

        if(!project){
            return res.status(404).json({message: "Project not found"});
        }

        const isMember = project.members.some((member)=>member.user.toString() === req.user._id.toString());

        if(!isMember){
            return res.status(403).json({message: "You are not a member of this project"});
        }

        const oldPriority = task.priority;
        task.priority = priority;
        await task.save();

        const activityData = {
            description:`Updated task priority from "${oldPriority}" to "${priority}"`
        }
        await recordActivity(
            
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_task", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);

    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const addSubTask = async(req, res) =>{
    try {
        const {taskId} = req.params;
    const {title} = req.title;
    const task = await Task.findById(taskId);

    if(!task){
        return res.status(404).json({message: "Task not found"});
    }

    const project = await Project.findById(task.project);

    if(!project){
        return res.status(404).json({message: "Project not found"});
    }

    const isMember = project.members.some((member)=>member.user.toString() === req.user._id.toString());

    if(!isMember){
        return res.status(403).json({message: "You are not a member of this project"});
    }

    const newSubTask = {
        title,
        complete:false,
    }

    task.subtasks.pusk(newSubTask._id);
    await task.save();

    const activityData = {
            description:`created subtask ${title}`
        }
    await recordActivity(
            
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "create_subtask", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const updatedSubTask = async(req, res) => {

   try {
    const {taskId, subTaskId} = req.params;
    const {completed} = req.completed;

    const task = await Task.findById(taskId);

    if(!task){
      return res.status(404).json({message: "Task not found"});
    }

    const subTask = task.subtasks.find((subTask)=> subTask._id.toString() === subTaskId);

    if (!subTask) {
      return res.status(404).json({message: "Subtask not found"});
    }

    subTask.completed = completed;
    await task.save();

    const activityData ={
        description:`Updated subtask "${subTask.title}"`
    }
    await recordActivity(
            
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_subtask", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);
   } catch (error) {
    return res.status(500).json({message: "Internal server error"});
   }


}
 
export const watchTask = async(req, res) =>{
    try {
        const {taskId} = req.params;

        const task = await Task.findById(taskId);

    if(!task){
      return res.status(400).json({message: "Task not found"});
    }

      const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

     const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const isWatching = task.watchers.some((watch)=>watch._id.toString() === req.user._id.toString());

        //isWatching === true nghĩa là: user đang nằm trong danh sách watchers.
        //isWatching === false nghĩa là: user chưa nằm trong danh sách.

    if(!isWatching){ //nếu user chưa nằm trong list nó hãy push nó lên 
        task.watchers.push(req.user._id);
    }
    else{
        //.filter() tạo ra 1 mảng mới và chỉ giữ lại các phần tử thỏa điều kiện.
        //là phương thức lọc (filter) nhiều phần tử theo điều kiện
        //User đang theo dõi task xoá user khỏi watchers
        task.watchers = task.watchers.filter((watch)=>watch.toString !== req.user._id.toString());
    }

     const activityData = {
         description: `${
        isWatching ? "stopped watching" : "started watching"
        } task ${task.title}`,
        }
        await recordActivity(
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_task", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const achievedTask = async (req, res) =>{

    try {
        const {taskId} = req.params;

    const task = await Task.findById(taskId);

    if(!task){
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if(!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

     const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const isArchived = task.isArchived;
    // giả sử isArchived = false
    task.isArchived = !isArchived;

    await task.save();

    const activityData = {
        description: `${isArchived ? "unachieved" : "achieved"} task ${
        task.title
        }`,
        }
        await recordActivity(
            req.user._id, // Ai làm hành động
            "Task",  // Loại hoạt động
            "updated_task", // Loại object
            taskId, // ID của task
            activityData // Dữ liệu thêm
        );
    res.status(200).json(task);

    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }


}



