import { signUpSchema } from '@/lib/schema';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardDescription, CardContent,CardFooter } from '@/components/ui/card';
import { FormItem, FormLabel,FormControl,FormMessage,FormField,Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useSignUpMutation } from '@/hook/use-auth';
import { toast } from 'sonner';

export type SignupFormData = z.infer<typeof signUpSchema> //sẽ tự động sinh một TypeScript type tương ứng với schema
const SignUp = () => {
  //để form biết kiểu dữ liệu mình đang validate
  const navigate = useNavigate();
  const form = useForm<SignupFormData>({
    //đây là cách nối React Hook Form với Zod,zodResolver
    //biến schema Zod thành hàm validate cho React Hook
    //Form mỗi lần bạn submit form, React Hook Form sẽ 
    //gọi zodResolver để kiểm tra dữ liệu có hợp lệ không
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      email:'',
      password:'',
      name:'',
      confirmPassword:''
    }
  });
  const {mutate,isPending} = useSignUpMutation();
  

  const handleOnSubmit = (values:SignupFormData)=>{
    mutate(values, {
      onSuccess: () => {
          toast.success("Email Verification Required",{
            description: "Please check your email for a verification link. If you don't see it, check your spam folder.",
            
          });
          form.reset(); //reset form after successful submission
          navigate("/sign-in"); //redirect to sign-in page
      },
      onError:(error:any) =>{
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      }
    });  
  }
  return (
    <div className='h-screen flex flex-col justify-center items-center bg-muted/40 p-4'>
     <Card className='w-full md:w-[500px] shadow-xl'>
        <CardHeader className='text-center mb-1'>
            <CardTitle className='text-2xl font-bold'>Create account</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Create a account to continue
            </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Truyền tất cả các props (thuộc tính) của form vào component Form bằng cú pháp spread operator */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
                      <FormField 
                        control ={form.control} 
                        name="email" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder='email@example.com' {...field} />
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                      <FormField 
                        control ={form.control} 
                        name="name" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder='Jhon Wick' {...field} />
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                      <FormField 
                        control ={form.control} 
                        name="password" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder='••••••••••••' {...field} />
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                      <FormField 
                        control ={form.control} 
                        name="confirmPassword" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder='••••••••••••' {...field} />
                          </FormControl>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                      <Button type="submit" className="w-full" disabled = {isPending}>
                        {isPending ? "Signing up ..." : "Sign Up"}
                      </Button>
                    </form>
                    <CardFooter className='flex items-center justify-center'>
                      <div className='flex items-center justify-center'>
                      <p className='text-sm text-muted-foreground'>
                        Already have an account?
                        <Link to="/sign-in" className='text-blue-600 underline hover:text-blue-950'>Sign in</Link>
                      </p>
                      </div>
                    </CardFooter>
                </Form>
            </CardContent>
     </Card>
    </div>
  )
}

export default SignUp
