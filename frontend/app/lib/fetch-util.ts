import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api-v1";

//Khởi tạo một axios instance riêng đặt tên là api
const api = axios.create({
    baseURL: BASE_URL, //mọi request sẽ tự động nối với BASE_URL.
    headers:{
        "Content-Type":"application/json" // dạng data type json.
    }
});

//Client lưu state, server không giữ: khi đăng nhập, server sinh token (JWT), ký chuyển về client.

//Client gửi token qua header Authorization: Bearer <token> với mỗi request, server giải mã và xác thực token

//Tự động thêm token vào header của request nếu token tồn tại trong localStorage

//Gửi token đến server
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token ?? ""}`; //Bearer souiqwqwnasisaxmhfhfghdg 
    }
    return config;
});
//Xử lý lỗi khi server trả về mã lỗi 401 (unauthorized).
//Phản ứng khi token hết hạn
//Gửi event force-logout để logout user
api.interceptors.response.use((response)=> response, (error)=>{
   if(error.response && error.response.status === 401){
    //localStorage.removeItem('token');
    //window.location.href = '/login';
    window.dispatchEvent(new Event("force-logout"))
   }
   return Promise.reject(error);
});

const postData = async<T>(url:string,data:unknown):Promise<T> =>{
    //T là kiểu dữ liệu generic — bạn có thể truyền kiểu trả về tuỳ ý khi gọi
    //dùng api.post<T> để gọi endpoint POST
    //server trả về response, axios sẽ gói trong response.data
    //response.data kiểu T
       const response = await api.post(url,data);
       return response.data;
}

const fetchData  = async<T>(url:string):Promise<T>=>{
    //path: string chính là phần đuôi của URL backend.
    //http://localhost:5050/api-v1/usersc
   
        const response = await api.get<T>(url);
        return response.data;

}

const updateData = async<T>(url:string,data:unknown):Promise<T>=>{
    
        const response = await api.put<T>(url,data);
        return response.data;
        
}

const deleteData = async<T>(url:string):Promise<T>=>{
        const response = await api.delete<T>(url);
        return response.data;
}


export {postData, deleteData, fetchData , updateData};



