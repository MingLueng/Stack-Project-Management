
export interface User {
   _id: string;
  email: string;
  name: string;
  createdAt: Date;
  isEmailVerified: boolean;
  updatedAt: Date;
  profilePicture?: string;
  
}

export interface Workspace{
  _id: string;
  name: string;
  description?: string; // 👈 thêm vào
  owner: User | string;
  color: string;
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "guest";
    jointAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";

export type TaskPriority = "High" | "Medium" | "Low";

export enum ProjectMemberRole {
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer",
}

export interface Project{
  _id:string;
  title:string;
  description?: string;
  status: ProjectStatus,
  workspace:Workspace;
  startDate: Date;
  dueDate: Date;
  tasks: Task[];
  progress:number;
  members:{
    user:User;
    role: "admin" | "member" | "owner" | "viewer";
  }[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  isArchived:boolean;
  tags:string;
}


export interface SubTask{
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Attachment{
  _id:string;
  fileName: string;
  fileUrl:string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}
export interface Task{
  _id:string;
  title:string;
  description?:string;
  status:TaskStatus;
  priority:TaskPriority;
  watchers?: User[] | string;
  assignees: User[];
  assignee:User | string;
  subtasks?: SubTask[];
  project: Project;
  attachments?: Attachment[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  createdBy: User | string;
}

export interface MembersProps{
    _id: string;
  user: User;
  role: "admin" | "member" | "owner" | "guest";
  jointAt: Date;
}

