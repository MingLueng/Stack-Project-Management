import { useMutation, useQuery } from "@tanstack/react-query";
import type {CreateWorkspaceData} from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-util";


//queryFn chính là callback mà React Query sẽ tự động chạy mỗi khi cần fetch lại dữ liệu (khi component mount, khi cache hết hạn, hoặc khi refetch thủ công).

export const useCreateWorkspaceMutation = () =>{
    //Nó được dùng để gửi dữ liệu lên server (POST, PUT, PATCH, DELETE), nói cách khác là thực hiện các side effects thay đổi dữ liệu.
    //Còn useQuery thì chủ yếu để lấy dữ liệu (GET).
    return useMutation({
        mutationFn:(data: CreateWorkspaceData) => postData("/workspaces",data),
    });

};

export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey:["workspaces"],
        queryFn: async () => fetchData("/workspaces"),

    });
};

export const useGetWorkspaceById = (workspaceId: string) => {
    return useQuery({
        queryKey:["workspaces",workspaceId],
        queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
    })
};


 