import { ProjectStatus, type MembersProps } from '@/type';
import React, { useState } from 'react';
import { z } from 'zod';
import { projectSchema } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogClose,DialogFooter,DialogDescription } from '../ui/dialog';
import { FormItem, FormLabel,FormControl,FormMessage,FormField,Form  } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from '../ui/select';
import clsx from 'clsx';
import { Popover,PopoverContent,PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader } from 'lucide-react';
import {Calendar} from '../ui/calendar';
import { format } from 'date-fns';
import { Checkbox } from "../ui/checkbox";
import { UseCreateProject } from '@/hook/use-project';
import { toast } from 'sonner';

interface CreateProjectDialogProps{
    isOpen: boolean;
    onClose: (open: boolean) => void; 
    workspaceId: string;
    workspaceMembers: MembersProps[];
      
}

export type CreateProjectFormData= z.infer<typeof projectSchema>;

export const CreateProjectDialog = ({
    isOpen,
    onClose,
    workspaceId,
    workspaceMembers
}:CreateProjectDialogProps) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues:{
        title:'',
        description:'',
        status:ProjectStatus.PLANNING,
        dueDate: '',
        startDate: '',
        members: [],
        tags: undefined,
    },
  });

  const {mutate,isPending} = UseCreateProject();

  const onHandleSubmit = (data: CreateProjectFormData) => {
    if(!workspaceId) return;
    mutate({
      projectData: data,
      workspaceId,
    },
    
    {
    onSuccess:()=>{
      form.reset();
      onClose(false);
      toast.success("Project created successfully");
  },
  onError:(error:any)=>{
    const errorMessage = error.response.data.message;
    toast.error("Failed to create project");
    console.log(errorMessage);
  }
}
)
  
  }


  return (
    <Dialog open={isOpen} 
      onOpenChange={onClose}
      modal={true}>
        <DialogContent className='sm:max-w-[540px]'>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project to get started
            </DialogDescription>
          </DialogHeader>
            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onHandleSubmit)} className='space-y-6 cursor-pointer'>
                      <FormField 
                        control ={form.control} 
                        name="title" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Project Title" {...field} />
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                      <FormField 
                        control ={form.control} 
                        name="description" 
                        render={({field}) =>(
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Project Description" {...field} rows={3} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                      />
                      <FormField 
                        control ={form.control} 
                        name="status"
                        render={({field}) =>(
                        <FormItem>
                          <FormLabel>Project Status</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select Project Status'/>
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(ProjectStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                         <FormField 
                        control ={form.control} 
                        name="startDate" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <Button 
                              variant={'outline'}
                              className={"w-full justify-start text-left font-normal" + (!field.value ? 'text-muted-foreground':'')}
                              >
                                <CalendarIcon className="size-4 mr-2"/>
                                {
                                  field.value ? ( format(new Date(field.value), 'dd/MM/yyyy' 

                                  )) : (
                                  <span>Pick a date</span>
                                  )
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent >
                              <Calendar 
                              mode="single" 
                              selected={field.value ? new Date(field.value) : undefined} 
                              onSelect={(date)=>{
                                field.onChange(date?.toISOString() || undefined);
                              }}/>
                            </PopoverContent>   
                          </Popover>
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                        <FormField 
                        control ={form.control} 
                        name="dueDate" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <Button 
                              variant={'outline'}
                              className={"w-full justify-start text-left font-normal" + (!field.value ? 'text-muted-foreground':'')}
                              >
                                <CalendarIcon className="size-4 mr-2"/>
                                {
                                  field.value ? ( format(new Date(field.value), 'dd/MM/yyyy' 

                                  )) : (
                                  <span>Pick a date</span>
                                  )
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent >
                              <Calendar 
                              mode="single" 
                              selected={field.value ? new Date(field.value) : undefined} 
                              onSelect={(date)=>{
                                field.onChange(date?.toISOString() || undefined);
                              }}/>
                            </PopoverContent>   
                          </Popover>
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                      </div>
                          <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Tags separated by comma" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                       <FormField 
                        control ={form.control} 
                        name="members" 
                        render={({field}) =>{
                          const selectedMembers = field.value || [];
                          return (
                              <FormItem>
                                <FormLabel>Members</FormLabel>
                                <FormControl>
                                  <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                      <Button variant={"outline"} className='w-full justify-start text-left font-normal min-h-11'>
                                        {
                                        // Nút này hiển thị tóm tắt danh sách các thành viên đã chọn 

                                        // selectedMembers là mảng giá trị hiện đang được chọn trong field.

                                        // workspaceMembers là danh sách tất cả thành viên có thể chọn.

                                        // Logic hiển thị:

                                        // Không chọn ai: “Select Members”.

                                        // Chọn ≤ 2 người: Hiển thị tên thật và role ("Alice (admin), Bob (member)").

                                        // Chọn > 2 người: Hiển thị số lượng "5 members selected". */}
                                          selectedMembers.length === 0 ? (
                                          <span className='text-muted-foreground'>
                                            Select Members
                                            </span>
                                            ) : selectedMembers.length <= 2 ? (
                                              selectedMembers.map((m) => {
                                                  const member = workspaceMembers.find((wm) => wm.user._id === m.user);
                                                  return `${member?.user.name} (${member?.role})`;
                                                })
                                            ) : (
                                             `${selectedMembers.length} members selected`
                                            )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-full max-w-60 overflow-y-auto' align="start">
                                      <div className="flex flex-col gap-2">
                                        {workspaceMembers.map((member) => {
                                          debugger
                                              const selectedMember = selectedMembers.find((m) => m.user === member.user._id);
                                              return(
                                                <div key={member._id} className ="flex items-center gap-2 p-2 border rounded">
                                                <Checkbox
                                                    id={`member-${member.user._id}`}
                                                    checked={!!selectedMember}
                                                    onCheckedChange={(checked) => {
                                                      if (checked) {
                                                        field.onChange([
                                                          ...selectedMembers,
                                                          {
                                                            user: member.user._id,
                                                            role: "contributor",
                                                          },
                                                        ]);
                                                      } else {
                                                        field.onChange(
                                                          selectedMembers.filter(
                                                            (m) => m.user !== member.user._id
                                                          )
                                                        );
                                                      }
                                                    }}
                                                    
                                                  />
                                                <span className='truncate flex-1'>
                                                  {member.user.name}
                                                </span>
                                                {
                                                  selectedMember && (
                                                    <Select 
                                                    value={selectedMember.role} 
                                                    onValueChange={(role) => {
                                                      field.onChange(
                                                        selectedMembers.map((m)=> m.user === member.user._id 
                                                        ? {
                                                          ...m, 
                                                          role: role as 
                                                          | "contributor"
                                                          | "manager"
                                                          | "viewer",
                                                        }
                                                        :m
                                                      )
                                                    );
                                                    }}>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Select Role" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="manager">
                                                          Manager
                                                        </SelectItem>
                                                        <SelectItem value="contributor">
                                                          Contributor
                                                        </SelectItem>
                                                        <SelectItem value="viewer">
                                                          Viewer
                                                        </SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                  )}
                                                </div>
                                              );
                                          })}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage/>
                              </FormItem>
                          );
                        
                      }}
                      />
                      <DialogFooter>
                          <Button type="submit" disabled={isPending} >
                              {isPending ? "Creating..." : "Create Project"}
                          </Button>
                      </DialogFooter>
                    </form>
                </Form>
        </DialogContent>

    </Dialog>
  )
}

