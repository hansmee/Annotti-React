import React from 'react';
import '../styles/main.css';

function ProjectName(){
  return (<input type='text' className='project-name' placeholder='New project name'/>);
}

function SelectTask(){
  return (
    <div id="select-task-div"> 
      <select id="select-task" defaultValue="None">
        <option value="None" disabled>Select task to annotate</option>
        <option value="IC">Image classification</option>
        <option value="OD">Object detection</option>
        <option value="SS">Semantic Segmentation</option>  
        <option value="OCR"> Optical character recognition</option>
      </select>
    </div>
  );
}

function SelectDirsButton(){
  return (<button className="select-dirs">Select working directory</button>);
}

function CreateProjectButton(){
  return (<button className="create-project">Create Project</button>)
}

function CreateProject(){
  return (
    <div className="create-project">
      <header className="create-project-header">
        <h1>Annotti</h1>
        <ProjectName />
        <SelectTask />
        <SelectDirsButton />
        <CreateProjectButton />
      </header>
    </div>
  );
}

// class CreateProject extends React.Component {
//   constructor(props: any) {
//     super(props);
//   }

//   render(){
//     return (
//       <div className="create-project">
//         <header className="create-project-header">
//           <h1>Annotti</h1>
//           <ProjectName />
//           <SelectTask />
//           <SelectDirsButton />
//           <CreateProjectButton />
//         </header>
//       </div>
//     );
//   }
// }

export default CreateProject;
