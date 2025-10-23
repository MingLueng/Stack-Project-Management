import React,{useState} from 'react';
import { z } from 'zod';
import {forgotPasswordSchema} from '@/lib/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router';
import { useForgotPasswordMutation } from '@/hook/use-auth';
import { CardHeader,CardContent,CardFooter,Card } from '@/components/ui/card';
import { FormItem, FormLabel,FormControl,FormMessage,FormField,Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle,ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
const ForgotPassword = () => {

const [isSuccess,setIsSuccess] = useState(false);

const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues:{
      email:'',
    }
  });
  const {mutate:forgotPassword,isPending} = useForgotPasswordMutation();

  const handleOnSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: any) => {
        setIsSuccess(false);
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
        console.log(error);
      },
    });
  };
  return (
        <div className='flex flex-col justify-center items-center h-screen'>
          <div className='w-full max-w-md space-y-6'>
            <div className='flex flex-col items-center mb-4'>
              <h1 className='font-2xl font-bold'>Forgot Password</h1>
              <p className='text-muted-foreground'>Enter your email to reset your password blow</p>
            </div>
              <Card className='max-w-md w-full shadow-xl'>
                  <CardHeader className='text-center mb-1'>
                      <Link to="/sign-in" className='flex gap-2 items-center'>
                        <ArrowLeft className='w-4 h-4' />
                          <span className='sr-only'>Back to Sign In</span>
                      </Link>
                      </CardHeader>
                      <CardContent>
                        {
                          isSuccess ? (
                          <div className='flex flex-col items-center justify-center'>
                            <CheckCircle className='w-12 h-12 mb-2 text-green-500' />
                            <h3 className='text-lg font-semibold'>Password reset email sent</h3>
                            <p className='text-sm text-gray-500'>Check your email for a link to reset your password</p>
                          </div>
                          ) : (
                            <>
                            <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-6'>
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder='Enter your email' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button type="submit" disabled={isPending} className='w-full'>
                                 {isPending ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Reset Password"
                                  )}
                              </Button>
                            </form>
                            </Form>
                            </>
                          
                          )
                        }
                  </CardContent>
              </Card>
          </div>
    </div>
  )
}

export default ForgotPassword
