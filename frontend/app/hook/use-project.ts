import {useMutation} from "@tanstack/react-query";
import type {CreateProjectFormData} from "@/components/project/create-project";
import { useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@/lib/fetch-util";
import { data } from "react-router";
import { useQuery } from "@tanstack/react-query";

export const UseCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const UseProjectQuery = (projectId: string)=>{
    return useQuery({
        queryKey:["project",projectId],
        queryFn:()=> fetchData(`/projects/${projectId}/tasks`),
        enabled: !!projectId, // chỉ chạy khi có projectId
    })
}