import { useMutation } from "@tanstack/react-query";
import type {SignupFormData} from "@/routes/auth/sign-up";
import { postData } from "@/lib/fetch-util";
import type { SigninFormData } from "@/routes/auth/sign-in";
import { use } from "react";
export const useSignUpMutation = () =>{
    //Nó được dùng để gửi dữ liệu lên server (POST, PUT, PATCH, DELETE), nói cách khác là thực hiện các side effects thay đổi dữ liệu.
    //Còn useQuery thì chủ yếu để lấy dữ liệu (GET)
    return useMutation({
        mutationFn:(data: SignupFormData) => postData("/auth/register",data),
    });
};

export const useVerifyEmailMutation = () =>{
    //Nó được dùng để gửi dữ liệu lên server (POST, PUT, PATCH, DELETE), nói cách khác là thực hiện các side effects thay đổi dữ liệu.
    //Còn useQuery thì chủ yếu để lấy dữ liệu (GET)
    return useMutation({
        mutationFn:(data:{token:string}) => postData("/auth/verify-email",data),
    });
}   

export const useSigninMutation = () =>{
    //Nó được dùng để gửi dữ liệu lên server (POST, PUT, PATCH, DELETE), nói cách khác là thực hiện các side effects thay đổi dữ liệu.
    //Còn useQuery thì chủ yếu để lấy dữ liệu (GET)
    return useMutation({
        mutationFn:(data:{email:string, password:string}) => postData("/auth/login",data),
    });
};

export const useResetPasswordMutation = () =>{
    return useMutation({
        mutationFn:(data:{token:string, newPassword:string, confirmPassword:string}) => postData("/auth/reset-password",data),
    });
};

export const useForgotPasswordMutation = () =>{
    return useMutation({
        mutationFn:(data:{email:string}) => postData("/auth/reset-password-request",data),
    });
}

