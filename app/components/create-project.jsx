import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Input, Button, Select } from 'antd';
const { Option } = Select;
const { remote, ipcRenderer } = require('electron');

import routes from '../constants/routes.json';
import alertError from '../utils/alert.js';

function ProjectName(props) {
  return (
    <Input
      type="text"
      style={{ width: '200px' }}
      className="project-name"
      placeholder="New project name"
      onChange={props.customChangeEvent}
    />
  );
}

function SelectTask(props) {
  return (
    <div id="select-task-div">
      <Select
        id="select-task"
        defaultValue="None"
        style={{ width: '200px' }}
        onChange={props.customChangeEvent}
      >
        <Option value="None" disabled>
          Select task to annotate
        </Option>
        <Option value="IC">Image classification</Option>
        <Option value="OD">Object detection</Option>
        <Option value="SS">Semantic Segmentation</Option>
        <Option value="OCR"> Optical character recognition</Option>
      </Select>
    </div>
  );
}

function SelectDirsButton(props) {
  return (
    <Button type="primary" className="select-dirs" onClick={props.customClickEvent}>
      Select working directory
    </Button>
  );
}

function CreateProjectButton(props) {
  if (props.taskId == 'IC')
    return (
      <Link
        to={routes.CLASSIFICATION}
        className="create-project-btn"
        onClick={props.customClickEvent}
      >
        Create Project
      </Link>
    );
  else if (props.taskId == 'OD')
    return (
      <Link to={routes.DETECTION} className="create-project-btn" onClick={props.customClickEvent}>
        Create Project
      </Link>
    );
}

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.projectName = 'DEBUG'; // null;
    this.taskId = 'IC'; // null;
    this.workingDirectory = ['/Users/yeon/Downloads/bwh', '/Users/yeon/Downloads/modify_bwh_w']; // "None";

    this.setProjectName = this.setProjectName.bind(this);
    this.selectTask = this.selectTask.bind(this);
    this.selectDirs = this.selectDirs.bind(this);
    this.clickCreateProjectButton = this.clickCreateProjectButton.bind(this);
  }

  setProjectName(e) {
    this.projectName = e.target.value;
  }

  selectTask(value) {
    this.taskId = value;
  }

  selectDirs() {
    this.workingDirectory = ipcRenderer.sendSync('selectDir');
  }

  clickCreateProjectButton() {
    if (this.taskId === null || this.workingDirectory === 'None' || this.projectName === null)
      alertError(
        'Fill all information',
        'You need to enter project name and select task and at least one working directory'
      );
    else {
      ipcRenderer.sendSync('setProjectManager', this.taskId);
      remote.getGlobal('projectManager').setWorkingDirectory(this.workingDirectory);
    }
  }

  render() {
    return (
      <div className="create-project">
        <h1>Annotti</h1>
        <ProjectName customChangeEvent={this.setProjectName} />
        <SelectTask customChangeEvent={this.selectTask} />
        <SelectDirsButton customClickEvent={this.selectDirs} />
        <CreateProjectButton
          customClickEvent={this.clickCreateProjectButton}
          taskId={this.taskId}
        />
      </div>
    );
  }
}

export default CreateProject;
