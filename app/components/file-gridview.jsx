import React from 'react';
import folderImg from '../imgs/folder.png';
import Canvas from './canvas';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import BreadCrumb from './bread-crumb';
import LabelMenu from './labels';

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
    const taskId = remote.getGlobal('projectManager').taskId;
    if (taskId === 'IC') return;
    const tab = {
      dataInfo: dataInfo,
      title: path.basename(dataInfo.dataPath),
      content: null,
    };
    const { tabData } = this.state;
    const sameElemIdx = tabData.findIndex((t) => t.dataInfo === tab.dataInfo);
    if (sameElemIdx === -1) {
      this.setState({
        isGridView: false,
        tabData: [tab].concat(tabData),
        activeTab: tab,
      });
    } else {
      this.setState({
        isGridView: false,
        activeTab: tabData[sameElemIdx],
      });
    }
  }

  removeTab(tab, e) {
    console.log(tab);
    console.log(e);
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

    const tabs = [];
    const tabPanels = [];

    this.state.tabData.map((tab, idx) => {
      tabs.push(
        <Tab key={idx} className="tab-title">
          <div>{path.basename(tab.title)}</div>
          <button className="close" type="button" title="Remove page" onClick={this.removeTab}>
            ×
          </button>
        </Tab>
      );
      tabPanels.push(
        <TabPanel key={idx} className="tab-contents">
          <div className="panel">
            <BreadCrumb breadClick={() => this.showGridView()}></BreadCrumb>
            <Canvas filePath={tab.dataInfo.dataPath} activeTab={this.state.activeTab}></Canvas>
          </div>
          <LabelMenu></LabelMenu>
        </TabPanel>
      );
    });

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
              alt={dataInfo.dataPath}
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
          <Tabs className="tabs">
            <TabList className="tab-list">{tabs}</TabList>
            {tabPanels}
          </Tabs>
        </div>
      );
    }
  }
}

export default FileGridView;
