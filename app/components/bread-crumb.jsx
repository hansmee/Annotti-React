import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const path = require('path');
const { remote } = window.require('electron');

class BreadCrumb extends Component {
  constructor(props) {
    super(props);
    const taskId = remote.getGlobal('projectManager').taskId;
    var workingDirectory = remote.getGlobal('projectManager').workingDirectory[0];
    while (workingDirectory.includes('\\')) {
      workingDirectory = workingDirectory.replace('\\', '/');
    }
    var filePath =
      taskId === 'IC'
        ? workingDirectory
        : workingDirectory + '/' + (props.filePath ? path.dirname(props.filePath) : '');

    //filePath = filePath.substring(path.dirname(workingDirectory).length);
    var dirList = filePath.split('/' || '\\');
    this.state = { dirList: dirList, rootDir: path.basename(workingDirectory) };
  }

  componentDidUpdate(prevProps) {
    if (this.props.filePath !== prevProps.filePath) {
      const taskId = remote.getGlobal('projectManager').taskId;
      var workingDirectory = remote.getGlobal('projectManager').workingDirectory[0];
      while (workingDirectory.includes('\\')) {
        workingDirectory = workingDirectory.replace('\\', '/');
      }
      var filePath =
        taskId === 'IC'
          ? workingDirectory
          : workingDirectory + '/' + (this.props.filePath ? path.dirname(this.props.filePath) : '');
      var dirList = filePath.split('/' || '\\');
      this.setState({
        dirList: dirList,
        rootDir: path.basename(workingDirectory),
      });
    }
  }

  render() {
    const { dirList } = this.state;
    const elements = dirList.map((dir, idx) => {
      if (dir === this.state.rootDir) {
        return (
          <Breadcrumb.Item key={idx} onClick={this.props.breadClick}>
            {dir}
          </Breadcrumb.Item>
        );
      } else {
        return <Breadcrumb.Item key={idx}>{dir}</Breadcrumb.Item>;
      }
    });
    return (
      <Breadcrumb>
        <Breadcrumb.Item href="">
          <HomeOutlined />
        </Breadcrumb.Item>
        {elements}
      </Breadcrumb>
    );
  }
}

export default BreadCrumb;
