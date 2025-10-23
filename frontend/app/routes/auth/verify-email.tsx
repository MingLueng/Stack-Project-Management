import {useEffect, useState} from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCheckIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useVerifyEmailMutation } from '@/hook/use-auth';
import { toast } from 'sonner';
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess,setIsSuccess] = useState(false);
  const {mutate, isPending:isVerifying} = useVerifyEmailMutation();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if(token){
      mutate({token}, {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success('Email verified successfully!');
        },
        onError: (error:any) => {
          const errorMessage = error.response?.data?.message || 'Email verification failed';
          setIsSuccess(false);
          console.log(error);
          toast.error(errorMessage);
            
        }
    });
    }
  }, [searchParams]);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>
        Verify Email
      </h1>
      <p className='text-sm text-gray-500'>Verifying your email</p>
      <Card className='max-w-md w-full'>
          <CardContent>
            <div className='flex flex-col items-center justify-center py-6 gap-4'>
              {isVerifying ? (
                <>
                  <Loader className='w-10 h-10 text-gray-500 animate-spin' />
                  <h3 className='text-lg font-semibold'>Verifying email...</h3> 
                  <p className='text-sm text-gray-500'>Please wait while we verify your email.</p>
                </> 
                ) : isSuccess ? (
                <>
                  <CheckCircle className='w-12 h-12 mb-2 text-green-500' />
                  <h3 className='text-lg font-semibold'>Email Verified Successfully!</h3>
                  <p className='text-sm text-gray-500'>You can now sign in to your account.</p>
                   <Link to="/sign-in" className='text-sm text-blue-500 mt-6'>
                  <Button variant="outline">Back to sign in</Button>
                  </Link>
                </>
                ) : (
                <>
                  <XCircle className='w-12 h-12 mb-2 text-red-500' />
                  <h3 className='text-lg font-semibold'>Email Verification Failed</h3>
                  <p className='text-sm text-gray-500'>The verification link is invalid or has expired.</p>
                  <Link to="/sign-in" className='text-sm text-blue-500 mt-6'>
                  <Button variant="outline">Back to sign in</Button>
                  </Link>
                </>
              )}

            </div>
          </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail
