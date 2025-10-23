import { Children, createContext, use, useContext, useEffect } from "react";
import type { User } from "@/type";
import { useState } from "react";
import { queryClient } from "./react-query-provider";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { publicRoutes } from "@/lib/index"; // Giả sử bạn đã định nghĩa publicRoutes trong file lib/index.ts
import { set } from "react-hook-form";

// 1. Định nghĩa interface context đúng dạng
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

// 2. Tạo context mặc định là undefined

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider component
export const AuthProvider = ({children}: {children: React.ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const currentPath = useLocation().pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);

    //Kiểm tra xem nếu user đã được xác thực chưa
    useEffect(()=>{
        const checkAuth = async()=>{
            setIsLoading(true);
           try {
             const userInfo = localStorage.getItem("user");
            if(userInfo){
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
            }
            else{
                setUser(null);
                setIsAuthenticated(false);
                if(!isPublicRoute){
                    navigate("/sign-in");
                }
            }
           } catch (error) {
            console.error("Auth check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    },[]);

    useEffect(()=>{
        const handleLogout = async()=>{
            logout();
            navigate("/sign-in");
        }
        window.addEventListener('force-logout', handleLogout);
        return () => {
            window.removeEventListener('force-logout', handleLogout);
        }
    },[]);

     // 4. Hàm login giả lập (có thể thay bằng Axios/fetch)
    const login = async (data: any)=>{
        localStorage.setItem("token",data.token); // Giả lập lưu token vào localStorage}));  
        localStorage.setItem("user", JSON.stringify(data.user)); // Giả lập lưu thông tin user vào localStorage
        setUser(data.user); // Giả lập lưu thông tin user vào state   
        setIsAuthenticated(true); // Giả lập đã đăng nhập

     }
     const logout = async ()=>{
        localStorage.removeItem("token"); // Giả lập xóa token khỏi localStorage
        localStorage.removeItem("user"); // Giả lập xóa thông tin user khỏi localStorage
        setUser(null); // Giả lập xóa thông tin user khỏi state
        setIsAuthenticated(false); // Giả lập đã đăng xuất
        queryClient.clear(); // Xóa cache của react-query
     }

     // 6. Gói giá trị vào context
    const values= {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
    return (
        <AuthContext.Provider value = {values}>{children}</AuthContext.Provider>
    );
};

    // 7. Hook tiện dụng để dùng context
    // Đây là một hook tùy chỉnh do bạn định nghĩa.hook này sẽ trả về giá trị có kiểu là AuthContextType
export const useAuth = (): AuthContextType => { 
    // Sử dụng useContext để lấy giá trị từ AuthContext.Provider.
    // Khi component nằm trong AuthProvider, ctx sẽ chứa { user, isAuthenticated, isLoading, login, logout }.
    // Nếu không nằm trong Provider, useContext(AuthContext) sẽ trả về undefined (theo cách khởi tạo).
    const ctx = useContext(AuthContext);
     if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}



