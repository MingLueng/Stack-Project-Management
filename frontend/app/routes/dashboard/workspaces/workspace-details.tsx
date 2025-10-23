import React,{useState} from 'react'
import { useParams } from 'react-router';
import { useGetWorkspaceById} from "@/hook/use-workspace";
import type { Workspace,Project } from "@/type";
import { Loader } from "lucide-react";
import {WorkspaceHeader} from '@/components/workspace/workspace-header';
import {ProjectList} from '@/components/workspace/project-list';
import { CreateProjectDialog } from '@/components/project/create-project';

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{workspaceId: string}>(); // Lấy giá trị của tham số 'id' từ URL
  const [isCreateProject,setIsCreateProject] = useState(false);
  const [isInviteMember,setIsInviteMember] = useState(false);
  

  if(!workspaceId){
    return <div>No workspace found</div>
  }
  const {data,isLoading} = useGetWorkspaceById(workspaceId) as {
    data: {
      workspace:Workspace;
      projects:Project[];
    };
    isLoading:boolean;
  }
  if(isLoading) {
      return(
      <div>
        <Loader />;
      </div>
      )
  }
  console.log(data)
  return (
    <div className="space-y-8">
      <WorkspaceHeader
      workspace={data.workspace}
      members={data?.workspace?.members as any}
      onCreateProject={()=> setIsCreateProject(true)}
      onInviteMember={()=> setIsInviteMember(true)}
      />
      <ProjectList
      workspaceId = {workspaceId}
      projects = {data.projects || []}
      onCreateProject = {()=>setIsCreateProject(true)}
      />

      <CreateProjectDialog 
      isOpen ={isCreateProject}
      onClose={setIsCreateProject}
      workspaceId = {workspaceId}
      workspaceMembers = {data?.workspace?.members as any}
      />
    </div>


  )
}

export default WorkspaceDetails;