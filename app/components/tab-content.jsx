import React, { Component } from 'react';
import BreadCrumb from './bread-crumb';
import LabelMenu from './labels';
import Canvas from './canvas';
import { Button } from 'antd';

const { remote } = window.require('electron');

class BottomMenu extends Component {
  constructor(props) {
    super(props);

    const taskId = remote.getGlobal('projectManager').taskId;
    var btnList = [];
    if (taskId === 'OD') {
      btnList = [
        { name: 'zoom in' },
        { name: 'zoom out' },
        { name: 'undo' },
        { name: 'redo' },
        { name: 'lock' },
      ];
    }

    this.state = {
      btnList: btnList,
    };
  }

  render() {
    if (this.state.btnList.length === 0) {
      return null;
    } else {
      const repVal = 'repeat(' + this.state.btnList.length + ',1fr)';
      return (
        <div className="bottom-menu" style={{ gridTemplateColumns: repVal }}>
          {this.state.btnList.map(function (btn, idx) {
            return (
              <Button key={idx} className="bottom-button">
                {btn.name}
              </Button>
            );
          })}
        </div>
      );
    }
  }
}

class Content extends Component {
  render() {
    return (
      <div className="tab-contents">
        <div className="panel">
          <BreadCrumb
            filePath={this.props.filePath}
            breadClick={this.props.breadClick}
          ></BreadCrumb>
          <div className="canvas-img">
            <Canvas filePath={this.props.filePath} activeTab={this.props.activeTab} />
            <BottomMenu />
          </div>
        </div>
        <LabelMenu />
      </div>
    );
  }
}

export default Content;
