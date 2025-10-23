import React,{useState} from 'react'
import type { Workspace } from '@/type';
import { useAuth } from '@/provider/auth-context';
import { CheckCircle2, ChevronsRight, ChevronsLeft, LogOut } from 'lucide-react';
import { ListCheck } from 'lucide-react';
import { Users } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { Settings } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router';
import { Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {SidebarNav} from '@/components/layout/sidebar-nav';
export const SidebarComponent = ({currentWorkspace}:{
  currentWorkspace: Workspace | null;
}) => {
  const {user,logout} = useAuth();
  const [isCollapsed , setIsCollapsed] = useState(false);

  const navItems =[
    {
      title:'Dashboard',
      href:"/dashboard",
      icon:LayoutDashboard
    },
    {
      title:'Workspaces',
      href:"/workspaces",
      icon:Users
    },
    {
      title:'My Tasks',
      href:"/my-tasks",
      icon:ListCheck
    },
    {
      title:'Achieved',
      href:"/achieved",
      icon:CheckCircle2
    },
    {
      title:'Settings',
      href:"/settings",
      icon:Settings
    },
  ]

  return (
    <div className={clsx('flex flex-col border-r bg-sidebar transition-all duration-300',
      isCollapsed ? "w-16 md:w-[80px]" : "w-16 md:w-[240px]")}>
        <div className='flex h-14 items-center border-b px-4 mb-4'>
          <Link to="/dashboard" className="flex items-center">
          {
            !isCollapsed && (<><div className='flex items-center gap-2'>
              <Wrench className="w-[24px] h-[24px] text-blue-600"/>
              <span className='font-semibold text-lg hidden md:block'>
                TaskHuh
              </span>
            </div>
            </>
          )}
          {
            isCollapsed && (<>
              <Wrench className="w-[24px] h-[24px] text-blue-600"/>
            </>
          )}
          </Link>

          <Button variant="ghost" size='icon' className='ml-auto hidden md:block' onClick={()=> setIsCollapsed(!isCollapsed)}>
            {
              isCollapsed ? 
              (
              <>
               <ChevronsRight className='w-[16px] h-[16px]'/>
              </>
              ):(
              <>
               <ChevronsLeft className='w-[16px] h-[16px]'/>
              </>
              )
            }
          </Button>
          </div>
          <ScrollArea className='flex flex-1 px-3 py-2'>
            <SidebarNav 
            items={navItems}
            isCollapsed={isCollapsed}
            className={clsx(isCollapsed ? 'items-center space-y-2':'')}
            currentWorkspace={currentWorkspace}
            />
          </ScrollArea>
          <div>
            <Button variant="ghost" size={isCollapsed ?'icon':'default'} 
            onClick={logout}>
            <LogOut className={clsx('w-[16px] h-[16px]',isCollapsed ? 'mr-2' : '')}/>
            <span className='hidden md:block'>Logout</span>
            </Button>
          </div>
    </div>
  )

 }
