import React from 'react';
import type { Workspace } from '@/type';
import { useAuth } from '@/provider/auth-context';
import { Button } from '../ui/button';
import { Bell,PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Link, useLoaderData } from 'react-router-dom';
import { User } from 'lucide-react';


interface HeaderProps {
      onWorkspaceSelected:(workspace: Workspace) => void;
      selectedWorkspace: Workspace | null;
      onCreateWorkspace:() => void;
}

export const Header = ({
    onWorkspaceSelected,
    selectedWorkspace,
    onCreateWorkspace
    }: HeaderProps
) => {
    const {user,logout} = useAuth();
    
//workspace?.workspaces: truy cập an toàn (?.) vì workspace có thể undefined.

//Array.isArray(...): kiểm tra xem workspace.workspaces có phải mảng không.

//Nếu đúng → lấy workspace.workspaces.

//Nếu sai → fallback về [] để tránh lỗi khi .map.

// header.tsx
const { workspaces } = useLoaderData() as {workspaces: { workspaces?: Workspace[] } | undefined};
const list = Array.isArray(workspaces?.workspaces) ? workspaces!.workspaces : [];
// console.log(list);
  return (
    <div className="bg-background sticky top-0 z-40 border-b">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
                 <Button variant={'outline'}>
                  {selectedWorkspace ? (
                  <> 
                  {
                    selectedWorkspace.color && (
                    <WorkspaceAvatar 
                    color={selectedWorkspace.color} 
                    name={selectedWorkspace.name} 
                    /> 
                  )
                  }
                  <span className='font-medium'>{selectedWorkspace?.name}</span>
                  </>
                  ) : ( 
                    <span className='font-medium'>Selected Workspace</span>
                 )}

                </Button>
              </DropdownMenuTrigger>
                    <DropdownMenuContent>
                     <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {list.map((ws) => (
                              <DropdownMenuItem
                                key={ws._id}
                                onClick={() => onWorkspaceSelected(ws)}
                              >
                                {ws.color && (
                                  <WorkspaceAvatar color={ws.color} name={ws.name} />
                                )}
                                <span className="ml-2">{ws.name}</span>
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                       <DropdownMenuGroup>
                             <DropdownMenuItem onClick={onCreateWorkspace}>
                              <PlusCircle className='mr-2 w-4 h-4'/>
                              Create Workspace
                             </DropdownMenuItem>
                     </DropdownMenuGroup>
                   </DropdownMenuContent>
           </DropdownMenu>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size='icon'>
                    <Bell />
                </Button>
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                    <button className='rounded-full border p-1 w-8 h-8'>
                        <Avatar className='w-8 h-8'>
                            <AvatarImage src={user?.profilePicture}></AvatarImage>
                            <AvatarFallback className='bg-black text-white'>
                                {/* toLowerCase là chuyển tất cả chuỗi string thành chữ thường */}
                                {user?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link to="/user/profile">Profile</Link>
                        </DropdownMenuItem>
                       <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={logout}>
                            Log out
                        </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
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
