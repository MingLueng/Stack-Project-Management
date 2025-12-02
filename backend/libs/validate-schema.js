import {z} from "zod";

const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be 8 characters"),
    name: z.string().min (3,"Name is required"),
})



const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be 8 characters"),

})

const verifyEmailSchema = z.object({
    token: z.string().min(1,"Token is required"),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1,"Token is required"),
    newPassword: z.string().min(8,"Password must be 8 characters"),
    confirmPassword: z.string().min(1,"Confirm password must be 8 characters"),

});

const resetPasswordRequestSchema = z.object({
    email: z.string().email("Invalid email address"),   
});



const projectSchema = z.object({
    title: z.string().min (3,"Title must be at least 3 characters"),
    description: z.string().optional(),  //Biến trường đó thành không bắt buộc (optional), nếu description không có mặt trong object → cũng không lỗi
    status: z.enum([
        "Planning",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
    ]),
    startDate: z.string().min(10,"Start date is required"),
    dueDate: z.string().min(10,"Due date is required"),
    members: z.array(
        z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
    })).optional(),
    tags:z.string().optional(),
});

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});
export {registerSchema,loginSchema,verifyEmailSchema,resetPasswordSchema,resetPasswordRequestSchema,projectSchema,taskSchema};