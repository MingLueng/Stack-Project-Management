import {fetchData, postData} from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskFormData } from "@/components/task/create-task-dialog";

export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data:{ projectId: string; taskData: CreateTaskFormData}) =>
            postData(`/tasks/${data.projectId}/create-task`,data.taskData),
        onSuccess: (data: any) =>{
            queryClient.invalidateQueries({
                queryKey:["project", data.project],
            });
        },
    });

    
}

