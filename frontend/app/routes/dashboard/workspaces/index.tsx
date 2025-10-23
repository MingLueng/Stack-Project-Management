import { Link, useLoaderData } from "react-router";
import { useState } from "react";
import type { Workspace } from "@/type";
import { Loader, Plus, PlusCircle, Users } from "lucide-react";
import { useGetWorkspacesQuery } from "@/hook/use-workspace";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { Button } from "@/components/ui/button";
import { NoDataFound } from "@/components/no-data-found";
import { WorkspaceAvatar } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const {data:rawData,isLoading} = useGetWorkspacesQuery() as {
        data: Workspace[];
        isLoading:boolean;
    }

    // ép kiểu về array, nếu không có thì []
    
    // Array.isArray(rawData)

    // Kiểm tra xem rawData có phải mảng không.

    // Nếu đúng → gán luôn rawData cho workspaces.

    // Trường hợp API trả thẳng về Workspace[].

    // (rawData as any)?.workspaces

    // Nếu rawData không phải mảng, ta giả định nó là một object có field workspaces.

    // (rawData as any)?.workspaces dùng optional chaining ?. để an toàn (nếu rawData undefined thì không lỗi, chỉ ra undefined).

    // Trường hợp API trả về dạng { workspaces: Workspace[] }.

    // Toán tử nullish coalescing: nếu giá trị bên trái là null hoặc undefined thì lấy [].

    // Đảm bảo workspaces luôn là mảng, tránh lỗi map is not a function.

    const workspaces: Workspace[] = Array.isArray(rawData)? rawData : (rawData as any)?.workspaces ?? [];
    if(isLoading) {
        return <Loader />;
    }
    return (
        <>
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>
                <Button className="" onClick={() => setIsCreatingWorkspace(true)}>
                    <PlusCircle className="size-4 mr-2" />
                    New Workspace
                </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {
                    workspaces.map((ws) => (
                        <WorkspacesCard key={ws._id} workspace={ws} />
                    ))
                }
                {
                    workspaces.length === 0 && 
                    
                    < NoDataFound
                        title="No workspaces found"
                        description="Create a new workspace to get started"
                        buttonText="Create Workspace"
                        buttonAction={() => setIsCreatingWorkspace(true)}
                     />
                    
                }
            </div>
        </div>
            <CreateWorkspace
                isCreatingWorkspace={isCreatingWorkspace}
                setIsCreatingWorkspace={setIsCreatingWorkspace} 
            />
        </>
    )

}

const WorkspacesCard = ({workspace}:{workspace:Workspace}) => {
    
return (
    <Link to={`/workspaces/${workspace._id}`}>
        <Card className="transition-all hover:shadow-md duration-200 hover:-translate-y-1">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                    <div>
                        <CardTitle>
                            {workspace.name}
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                            Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                        </span>
                    </div>
                    </div>
                <div className="flex items-center text-muted-foreground">
                    <Users className="size-4 mr-1"/>
                        <span className="text-xs">
                            {workspace.members.length}
                        </span>
                </div>
                 </div>
                 <CardDescription>
                    {workspace?.description || "No description"}
                 </CardDescription>
                 <CardContent>
                    <div className="text-sm text-muted-foreground">
                        View workspace details and projects
                    </div>
                 </CardContent>
            </CardHeader>
        </Card>
    </Link>
    
)

}

export default Workspaces