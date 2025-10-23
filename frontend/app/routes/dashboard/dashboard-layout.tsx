import React,{useState} from 'react';
import { useAuth } from '@/provider/auth-context';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import {Header} from '@/components/layout/header';
import type { Workspace } from '@/type/index';
import {SidebarComponent} from '@/components/layout/sidebar-component';
import {CreateWorkspace} from '@/components/workspace/create-workspace';
import { fetchData } from '@/lib/fetch-util';

//React Router Loader: truyền dữ liệu vào component trước khi render.

//Preload dữ liệu workspace từ API /workspaces.

//Giúp bạn gọi nhiều API song song trong tương lai (vì Promise.all có thể mở rộng thêm).

export const clientLoader = async() =>{
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
    
  } catch (error) {
    console.log(error);
  }
}
const DashboardLayout = () => {
    const {isAuthenticated, isLoading} = useAuth();
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

    if (isLoading) {
        return <Loader />;
    }

    if(!isAuthenticated) {
      return <Navigate to= "/sing-in" />
    }

    const handleWorkspaceSelected = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
    }
  return (
   <div className='flex h-screen w-full'>
    <SidebarComponent currentWorkspace={currentWorkspace}/>
    {/* Sidebar can be added here */}
    <div className='flex flex-1 flex-col h-full'>
      <Header 
      onWorkspaceSelected={handleWorkspaceSelected}
      selectedWorkspace={currentWorkspace}
      onCreateWorkspace={()=> setIsCreatingWorkspace(true)} />

      <main className='flex-1 overflow-y-auto w-full h-full'>
       <div className='mx-auto container px-2 sm:px-6 lg:px-8 md:py-8 py-0 w-full h-full'>
        <Outlet />
       </div>
      </main>
    </div>
    <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace} />
   </div>
  )
}

export default DashboardLayout