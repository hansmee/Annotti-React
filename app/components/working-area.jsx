import React from 'react';
import FileGridView from './file-gridview';
import LabelMenu from './labels';
import BreadCrumb from './bread-crumb';
import { imgExtensions } from '../utils/exts';

const fs = window.require('fs');
const path = require('path');
const { remote } = window.require('electron');

class MainView extends React.Component {
  constructor(props) {
    super(props);
    var workingDirectory = remote.getGlobal('projectManager').workingDirectory;
    var initialDataInfos = [];
    for (const folderPath of workingDirectory) {
      initialDataInfos.push({ dataPath: folderPath, isDir: 1, imgInfoId: null });
    }
    this.id = 0;
    this.state = { dataInfos: initialDataInfos };
    this.readFolder = this.readFolder.bind(this);
    this.clickFolder = this.clickFolder.bind(this);
  }

  async readFolder(folderPath) {
    var dataInfos = [];
    var dataPaths = [];
    var dir = await fs.promises.opendir(folderPath);
    for await (const dirent of dir) {
      var dataPath = path.resolve(folderPath, dirent.name);
      if (imgExtensions.includes(path.extname(dataPath))) {
        if (dirent.isDirectory()) {
          dataInfos.push({ dataPath: dataPath, isDir: 1 });
        } else {
          dataInfos.push({ dataPath: dataPath, isDir: 0, imgInfoId: this.id++ });
          dataPaths.push(dataPath);
        }
      }
    }
    remote.getGlobal('projectManager').appendDataPaths(dataPaths);
    this.setState({ dataInfos: dataInfos });
  }

  clickFolder(e) {
    var selectedFolderPath = e.target.id;
    this.readFolder(selectedFolderPath);
  }

  render() {
    return (
      <div className="main-view">
        <BreadCrumb></BreadCrumb>
        <FileGridView
          dataInfos={this.state.dataInfos}
          customClickFolderEvent={this.clickFolder}
        ></FileGridView>
      </div>
    );
  }
}

function WorkingArea(props) {
  const taskId = remote.getGlobal('projectManager').taskId;
  if (taskId === 'IC') {
    return (
      <div className="working-area">
        <MainView></MainView>
        <LabelMenu></LabelMenu>
      </div>
    );
  } else if (taskId === 'OD') {
    return (
      <div className="working-area">
        <MainView></MainView>
      </div>
    );
  }
}

export default WorkingArea;
