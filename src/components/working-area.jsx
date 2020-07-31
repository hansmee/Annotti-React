import React from 'react';
import '../styles/main.less';
import LabelMenu from './labels';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { imgExtensions } from '../utils/exts';
import folderImg from '../imgs/folder.png';

const fs = window.require('fs');
const path = require('path');
const { remote } = window.require('electron');

function TabList() {
  // 열려있는 탭 목록
  return <h1>TabList</h1>;
}

function BreadCrumb(props) {
  // 선택된 파일 경로
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="" onClick={props.customClickEvent}>
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="">
        <span>Application List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Application</Breadcrumb.Item>
    </Breadcrumb>
  );
}

// function SingleImgView() {
//   // Canves
//   return <h1>DataView</h1>;
// }

function FileGridView(props) {
  const dataInfos = props.dataInfos;
  const elements = dataInfos.map((dataInfo) => {
    if (dataInfo.isDir)
      return (
        <div className="folder-info" key={dataInfo.dataPath}>
          <img
            className="folder-thumbnail"
            id={dataInfo.dataPath}
            src={folderImg}
            style={{ display: 'block', width: '80px', height: '80px' }}
            alt={dataInfo.dataPath}
            onClick={props.customClickFolderEvent}
          ></img>
          <a href="/" className="img-name">
            {path.basename(dataInfo.dataPath)}
          </a>
        </div>
      );
    else {
      return (
        <div className="img-info" key={dataInfo.dataPath} id={dataInfo.imgInfoId}>
          <img
            className="thumbnail"
            id={dataInfo.imgInfoId}
            src={dataInfo.dataPath}
            style={{ display: 'block', width: '80px', height: '80px' }}
            alt={dataInfo.dataPath}
          ></img>
          <a href="/" className="img-name">
            {path.basename(dataInfo.dataPath)}
          </a>
        </div>
      );
    }
  });
  return <div className="grid-view">{elements}</div>;
}

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
        <TabList></TabList>
        <BreadCrumb></BreadCrumb>
        <FileGridView
          dataInfos={this.state.dataInfos}
          customClickFolderEvent={this.clickFolder}
        ></FileGridView>
      </div>
    );
  }
}

function WorkingArea() {
  return (
    <div className="working-area">
      <MainView></MainView>
      <LabelMenu></LabelMenu>
    </div>
  );
}

export default WorkingArea;
