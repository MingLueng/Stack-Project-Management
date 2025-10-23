import {z} from "zod";
export const workspaceSchema = z.object({
     name: z.string().min (3,"Name is required"),
     color: z.string().min (3,"Color is required"),
     description: z.string().optional(), //Biến trường đó thành không bắt buộc (optional), nếu description không có mặt trong object → cũng không lỗi
});