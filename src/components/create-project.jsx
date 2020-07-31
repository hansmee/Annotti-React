import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/main.css';
import Classification from './classification';

const { remote, ipcRenderer } = window.require("electron");
const { alertError } = require('../utils/alert.js')

function ProjectName(props){
  return (<input type='text' className='project-name' placeholder='New project name' onChange={props.customChangeEvent}/>);
}

function SelectTask(props){
  return (
    <div id="select-task-div"> 
      <select id="select-task" defaultValue="None" onChange={props.customChangeEvent}>
        <option value="None" disabled>Select task to annotate</option>
        <option value="IC">Image classification</option>
        <option value="OD">Object detection</option>
        <option value="SS">Semantic Segmentation</option>  
        <option value="OCR"> Optical character recognition</option>
      </select>
    </div>
  );
}

function SelectDirsButton(props){
  return (<button className="select-dirs" onClick={props.customClickEvent}>Select working directory</button>);
}

function CreateProjectButton(props){
  return (<button className="create-project" onClick={props.customClickEvent}>Create Project</button>);
}


class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.projectName = "DEBUG" // null;
    this.taskId = "IC" // null;
    this.workingDirectory = ["/Users/yeon/Downloads/bwh", "/Users/yeon/Downloads/modify_bwh_w"]; // "None";

    this.setProjectName = this.setProjectName.bind(this);
    this.selectTask = this.selectTask.bind(this);
    this.selectDirs = this.selectDirs.bind(this);
    this.clickCreateProjectButton = this.clickCreateProjectButton.bind(this);
  }
  
  setProjectName(e){
    this.projectName = e.target.value;
  }

  selectTask(e){
    this.taskId = e.target.value;
  }

  selectDirs(){
    this.workingDirectory = ipcRenderer.sendSync('selectDir');
  }

  clickCreateProjectButton() {
    if(this.selecId===null || this.workingDirectory==="None" || this.projectName===null)
      alertError('Fill all information', 'You need to enter project name and select task and at least one working directory');
    else{
      ipcRenderer.sendSync('setProjectManager', this.taskId);
      remote.getGlobal('projectManager').setWorkingDirectory(this.workingDirectory);
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      if(this.taskId === "IC"){
        ReactDOM.render(<Classification/>, document.getElementById('root'))
      }
      else{
        console.log("Other than classification")
      }
    }
  }

  render(){
    return (
      <div className="create-project">
        <header className="create-project-header">
          <h1>Annotti</h1>
          <ProjectName customChangeEvent={this.setProjectName}/>
          <SelectTask customChangeEvent={this.selectTask}/>
          <SelectDirsButton customClickEvent={this.selectDirs}/>
          <CreateProjectButton customClickEvent={this.clickCreateProjectButton}/>
        </header>
      </div>
    );
  }
}

export default CreateProject;
