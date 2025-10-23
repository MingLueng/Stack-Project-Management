import React,{useState} from 'react';
import { z } from 'zod';
import { workspaceSchema } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogClose,DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { FormItem, FormLabel,FormControl,FormMessage,FormField,Form  } from '@/components/ui/form';
import { Button } from '../ui/button';
import clsx from 'clsx';
import {useCreateWorkspaceMutation} from '@/hook/use-workspace';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';


interface CreateWorkspaceProps {
      isCreatingWorkspace:boolean;
      setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export const colorOptions= [
    "#FF5733", // Red-Orange
    "#33C1FF", // Blue
    "#28A745", // Green
    "#FFC300", // Yellow
    "#8E44AD", // Purple
    "#E67E22", // Orange
    "#2ECC71", // Light Green
    "#34495E", // Navy
]
export type CreateWorkspaceData = z.infer<typeof workspaceSchema> //sẽ tự động sinh một TypeScript type tương ứng với schema
export const CreateWorkspace = (
{
    isCreatingWorkspace,
    setIsCreatingWorkspace,

}:CreateWorkspaceProps) => {
  const navigate = useNavigate();
  const {mutate,isPending}= useCreateWorkspaceMutation();
    const form = useForm<CreateWorkspaceData>({
        resolver: zodResolver(workspaceSchema),
        defaultValues:{
            name:'',
            color: colorOptions[0],
            description:'',
        }
        });
    const onHandleSubmit = (data: CreateWorkspaceData) =>{
       mutate(data, {
          onSuccess: (data: any) => {
          // const workspaceId = data?.workspace?._id;
          form.reset(); //reset form after successful submission
          setIsCreatingWorkspace(false);
          toast.success("Workspace created successfully");
          navigate(`/workspaces/${data.workspace._id}`);

          },
          onError:(error:any) =>{
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
            console.log(error);
          }
      }); 
    }

  return (
    <Dialog open={isCreatingWorkspace} 
      onOpenChange={setIsCreatingWorkspace}
      modal={true}>
        <DialogContent className='max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
            </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onHandleSubmit)}>
                    <div className="space-y-4 py-4">
                      <FormField 
                        control ={form.control} 
                        name="name" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Workspace Name" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Workspace Description" {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                      />
                      <FormField 
                        control ={form.control} 
                        name="color" 
                        render={({field}) =>(
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                           <div className="flex gap-2">
                            {colorOptions.map((item)=>(
                              <div key={item} 
                              className={clsx('w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300',field.value === item ? 'ring-2 ring-blue-500 ring-offset-1': '' )} 
                              onClick={()=> field.onChange(item)}
                              style={{backgroundColor:item}}>
                              </div>
                            ))}
                           </div>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                          {isPending ? 'Creating ...' : 'Create'}
                        </Button>
                      </DialogFooter>
                     </div>
                    </form>
                </Form>
        </DialogContent>
    </Dialog>

  )
}



