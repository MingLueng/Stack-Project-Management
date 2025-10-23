import {z} from 'zod';
import { ProjectStatus } from '@/type';
//z	là Import từ thư viện zod, dùng để tạo schema cho validation (giống Yup)
//signInSchema là một schema được định nghĩa bằng zod, ví dụ chứa email, password
// z.infer<typeof ...> là trích xuất ra kiểu TypeScript tương ứng với schema
//SigninFormData là type đại diện cho dữ liệu form đầu vào được hợp lệ hóa

//Nó giúp xác thực (validate) dữ liệu ở runtime
export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6,"Password is required"),
})

export const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must be 8 characters"),
    name: z.string().min (3,"Name must be at least 3 characters"),
    confirmPassword: z.string().min(8,"Password must be 8 characters")
}).refine((data) => data.password === data.confirmPassword,{ //validate logic tổng thể giữa các field
    path:["confirmPassword"],
    message:"Passwords do not match"
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8,"Password must be 8 characters"),
    confirmPassword: z.string().min(1,"Confirm password must be 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword,{ //validate logic tổng thể giữa các field
    path:["confirmPassword"],
    message:"Passwords do not match"
});
export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const workspaceSchema = z.object({
     name: z.string().min (3,"Name must be at least 3 characters"),
     color: z.string().min (3,"Color must be at least 3 characters"),
     description: z.string().optional(), //Biến trường đó thành không bắt buộc (optional), nếu description không có mặt trong object → cũng không lỗi
});

export const projectSchema = z.object({
    title: z.string().min (3,"Title must be at least 3 characters"),
    description: z.string().optional(),  //Biến trường đó thành không bắt buộc (optional), nếu description không có mặt trong object → cũng không lỗi
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(10,"Start date is required"),
    dueDate: z.string().min(10,"Due date is required"),
    members: z.array(
        z.object({
        user: z.string(),
        role: z.enum(["manager","contributor","viewer"]),
    })).optional(),
    tags:z.string().optional(),
});

