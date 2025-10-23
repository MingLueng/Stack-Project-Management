import React from 'react'
import type { Project } from '@/type'
import { NoDataFound } from '../no-data-found';
import { ProjectCard } from '../project/project-card';

interface ProjectListProps{
    workspaceId: string;
    projects: Project[];
    onCreateProject:() => void;
}
export const ProjectList = ({
    workspaceId,
    projects,
    onCreateProject,
}:ProjectListProps
) => {

  return (
    <div>
      <h3 className='text-lg font-semibold mb-4'>Projects</h3>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {projects.length === 0 ?( 
          <NoDataFound 
          title='No projects found' 
          description='Create a new project to get started'
          buttonAction={onCreateProject} 
          buttonText='Create Project'
          /> 
        ) : ( 
          projects.map((project) => (
          <ProjectCard 
          key={project._id} 
          project= {project} 
          progress= {project.progress} 
          workspaceId={workspaceId} />
        )))
        }
      </div>
    </div>
  )
}

