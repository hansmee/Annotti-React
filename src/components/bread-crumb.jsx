import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const path = require('path');
const { remote } = window.require('electron');

class BreadCrumb extends Component {
  constructor(props) {
    super(props);
    var workingDirectory = remote.getGlobal('projectManager').workingDirectory;
    var filePath = props.filePath.substring(path.dirname(workingDirectory).length);
    var dirList = filePath.split('/' || '\\');

    this.state = { dirList: dirList, rootDir: path.basename(workingDirectory) };
  }

  render() {
    const dirList = this.state.dirList;
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
