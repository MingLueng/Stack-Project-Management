import type { LucideIcon } from 'lucide-react'
import React from 'react'
import type { Workspace } from '@/type/index';
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router';
import clsx from 'clsx';

interface SidebarProps extends React.HtmlHTMLAttributes<HTMLElement>{
   items:{
    title:string,
    href:string,
    icon:LucideIcon
   }[];
   isCollapsed:boolean;
   currentWorkspace: Workspace | null;
   className?:string;
}
export const SidebarNav = (
  {
    items,
    isCollapsed,
    className,
    currentWorkspace
    }: SidebarProps
) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <nav className={clsx('flex flex-col gap-y-2',className)}>
        {
          items.map((el)=>{
            const isActive = location.pathname === el.href;
            const Icon = el.icon;
            const handleClick = () => {
              if(el.href === '/workspaces'){
                navigate(el.href)
              }
              else if(currentWorkspace && currentWorkspace._id){
                navigate(`${el.href}?workspaceId=${currentWorkspace._id}`)
              }
              else{
                navigate(el.href)
              }
            }
            
            return <Button key={el.href} variant={isActive ? 'outline':'ghost'} className={clsx('justify-start',isActive ? 'bg-blue-800/20 text-blue-600 font-medium':'')}
            onClick={handleClick}>
                <Icon className='mr-2 h-[16px] w-[16px]' />
                {
                  
                  isCollapsed ? (
                  <>
                    <span className='absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0'>{el.title}</span>
                  </>
                  ):(
                  <>
                  {el.title}
                  </>
                  )
                }
            </Button>
          })
        }
      </nav>
    </div>
  )
}


