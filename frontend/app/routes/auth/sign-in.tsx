import { signInSchema } from '@/lib/schema';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardDescription, CardContent,CardFooter } from '@/components/ui/card';
import { FormItem, FormLabel,FormControl,FormMessage,FormField,Form  } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useSigninMutation } from '@/hook/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/provider/auth-context';
//là một cách để tự động tạo kiểu dữ liệu (type) cho form đăng nhập (SigninFormData)
//dựa trên schema kiểm tra đầu vào (signInSchema) được định nghĩa bằng thư viện zod.
export type SigninFormData = z.infer<typeof signInSchema>
const SignIn = () => {
  //để form biết kiểu dữ liệu mình đang validate
  const navigate = useNavigate();
  const {login} = useAuth();
  const form = useForm<SigninFormData>({
    //đây là cách nối React Hook Form với Zod,zodResolver
    //biến schema Zod thành hàm validate cho React Hook
    //Form mỗi lần bạn submit form, React Hook Form sẽ 
    //gọi zodResolver để kiểm tra dữ liệu có hợp lệ không
    resolver: zodResolver(signInSchema),
    defaultValues:{
      email:'',
      password:'',
    }
  });
  const {mutate,isPending} = useSigninMutation();
  const handleOnSubmit = (values:SigninFormData)=>{
    mutate(values, {
      onSuccess: (data) => {
        login(data); //gọi hàm login từ context để lưu thông tin đăng nhập
          toast.success("Sign in successful",{
            description: "You have successfully signed in.",
          });
          navigate('/dashboard'); //redirect to dashboard after successful sign in
      },
      onError:(error:any) =>{
        const errorMessage = error.response?.data?.message || "An error occurred";
        console.log(error);
        toast.error(errorMessage);
      }
    });
  }
  
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-muted/40 p-4'>
     <Card className='max-w-md w-full shadow-xl'>
        <CardHeader className='text-center mb-1'>
            <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Sign in to your account to continue
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
                        name="password" 
                        render={({field}) =>(
                         <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className='flex flex-col items-end justify-between'>
                          <FormControl>
                            <Input type="password" placeholder='••••••••••' {...field} />
                          </FormControl>
                               <Link to="/forgot-password" className='text-sm text-blue-600'>
                            Forgot password?
                          </Link>
                          </div>
                          <FormMessage/>
                         </FormItem>
                      )}
                      />
                        <Button type="submit" className="w-full" disabled = {isPending}>
                          {isPending ? "Signing in ..." : "Sign In"}
                        </Button>
                    </form>
                    <CardFooter>
                      <div className='flex items-center justify-center'>
                      <p className='text-sm text-muted-foreground'>
                        Don&apos;t have an account?{" "}
                        <Link to="/sign-up" className='text-blue-600 underline hover:text-blue-950'>Sign up</Link>
                      </p>
                      </div>
                    </CardFooter>
                </Form>
            </CardContent>
     </Card>
    </div>
  )
}

export default SignIn
