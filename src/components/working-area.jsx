import React from 'react';
import '../styles/main.less';
import LabelMenu from './labels';
import Tabs from './tab';
import Content from './tab-content';
import BreadCrumb from './bread-crumb';
import { imgExtensions } from '../utils/exts';
import folderImg from '../imgs/folder.png';

const fs = window.require('fs');
const path = require('path');
const { remote } = window.require('electron');

class FileGridView extends React.Component {
  constructor(props) {
    super(props);

    var tabData = [];
    this.state = {
      isGridView: true,
      tabData: tabData,
      activeTab: null,
    };

    this.showGridView = this.showGridView.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addTab = this.addTab.bind(this);
    this.removeTab = this.removeTab.bind(this);
  }

  showGridView() {
    this.setState({ isGridView: true });
  }

  handleClick(tab) {
    this.setState({ activeTab: tab });
  }

  addTab(dataInfo) {
    const tab = {
      dataInfo: dataInfo,
      title: path.basename(dataInfo.dataPath),
      isActive: true,
      content: null,
    };
    const { tabData } = this.state;
    this.setState({
      isGridView: false,
      tabData: tabData.concat(tab),
      activeTab: tab,
    });
  }

  removeTab(tab, e) {
    e.stopPropagation();
    const { tabData } = this.state;
    if (tabData.length > 1) {
      this.setState({
        tabData: tabData.filter((element) => element.title !== tab.title),
        activeTab: tabData[(tabData.findIndex((element) => element === tab) + 1) % tabData.length],
      });
    } else if (tabData.length === 1) {
      this.setState({
        isGridView: true,
        tabData: tabData.filter((element) => element.title !== tab.title),
        activeTab: null,
      });
    }
  }

  render() {
    const dataInfos = this.props.dataInfos;
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
              onClick={this.props.customClickFolderEvent}
            ></img>
            <a href="/" className="img-name">
              {path.basename(dataInfo.dataPath)}
            </a>
          </div>
        );
      else {
        return (
          <div
            className="img-info"
            key={dataInfo.dataPath}
            id={dataInfo.imgInfoId}
            onClick={() => this.addTab(dataInfo)}
          >
            <img
              className="thumbnail"
              id={dataInfo.imgInfoId}
              src={dataInfo.dataPath}
              style={{ display: 'block', width: '80px', height: '80px' }}
              // alt={dataInfo.dataPath}
              alt={''}
            ></img>
            <a href="/" className="img-name">
              {path.basename(dataInfo.dataPath)}
            </a>
          </div>
        );
      }
    });
    if (this.state.isGridView) {
      return <div className="grid-view">{elements}</div>;
    } else {
      return (
        <div className="tab-area">
          <Tabs
            activeTab={this.state.activeTab}
            changeTab={this.handleClick}
            tabData={this.state.tabData}
            removeTab={this.removeTab}
          />
          <Content
            activeTab={this.state.activeTab}
            filePath={this.state.activeTab.dataInfo.dataPath}
            breadClick={this.showGridView}
          />
        </div>
      );
    }
  }
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
    if (this.props.task === 'IC') {
      return (
        <div className="main-view">
          <BreadCrumb filePath={this.workingDirectory}></BreadCrumb>
          <FileGridView
            dataInfos={this.state.dataInfos}
            customClickFolderEvent={this.clickFolder}
          ></FileGridView>
        </div>
      );
    } else if (this.props.task === 'OD') {
      return (
        <div className="main-view">
          <FileGridView
            dataInfos={this.state.dataInfos}
            customClickFolderEvent={this.clickFolder}
          ></FileGridView>
        </div>
      );
    }
  }
}

function WorkingArea(props) {
  if (props.task === 'IC') {
    return (
      <div className="working-area">
        <MainView task="IC"></MainView>
        <LabelMenu></LabelMenu>
      </div>
    );
  } else if (props.task === 'OD') {
    return (
      <div className="working-area">
        <MainView task="OD"></MainView>
      </div>
    );
  }
}

export default WorkingArea;
