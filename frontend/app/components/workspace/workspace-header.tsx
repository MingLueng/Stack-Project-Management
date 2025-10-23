import React from 'react'
import type { Workspace,User } from '@/type';
import { Plus, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface WorkspaceHeaderProps{
    workspace:Workspace;
    members: {
        _id:string;
        user: User;
        role: "admin" | "member" | "owner" | "guest";
        jointAt: Date;
    }[],
    onCreateProject:() => void;
    onInviteMember:() => void;
}
export const WorkspaceHeader = ({
    workspace,
    members,
    onCreateProject,
    onInviteMember,
}:WorkspaceHeaderProps) => {
  return (

        <div className="space-y-3">
            <div className="space-y-2 flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
                <div className='flex md:items-center gap-3'>
                    {workspace.color && (<WorkspaceAvatar color = {workspace.color} name= {workspace.name} />)}
                    <h2 className='text-lg font-semibold'>
                        {workspace.name}
                    </h2>
                </div>
                <div className="flex items-center gap-3 justify-between md:justify-start mb-4 md:mb-0">
                    <Button variant={"outline"} onClick={onInviteMember}>
                      <UserPlus className="size-4 mr-2" />
                      Invite
                    </Button>
                    <Button onClick={onCreateProject}>
                      <Plus className="size-4 mr-2"/>
                      Create Project
                    </Button>
                </div>
            </div>
            {
              workspace.description && <p className='text-sm md:text-base text-muted-foreground'>
                {workspace.description}
              </p>
            }
            {members.length > 0  && (<div className='flex items-center gap-2'>
                <span className="text-sm text-muted-foreground">Members</span>
                <div className="flex space-x-2">
                  {members.map((member) => (
                    <Avatar 
                    key={member._id} 
                    className="w-8 h-8 rounded-full border-2 relative border-background overflow-hidden cursor-pointer" 
                    title={member.user.name}
                    >
                      <AvatarImage 
                      src={member.user.profilePicture} 
                      alt={member.user.name}/>
                          <AvatarFallback>
                            {member.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                     
                    </Avatar>
                  ))}

                </div>
              </div>
            )}

            

        </div>
   
  )
}


interface WorkspaceAvatarProps {
  color: string;  
  name: string;
}
export const WorkspaceAvatar = (
{
    color,
    name,

}:WorkspaceAvatarProps) =>  {
  return (
    <div
      className="w-6 h-6 rounded flex items-center justify-center"
      style={{
        backgroundColor: color,
      }}
    >
      <span className="text-xs font-medium text-white">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
