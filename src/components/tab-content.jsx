import React, { Component } from 'react';
import BreadCrumb from './bread-crumb';
import { Button } from 'antd';

const { remote } = window.require('electron');
const taskId = remote.getGlobal('projectManager').taskId;

class BottomMenu extends Component {
  constructor(props) {
    super(props);

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
    if (this.state.btnList.length == 0) {
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
        <BreadCrumb filePath={this.props.filePath} breadClick={this.props.breadClick}></BreadCrumb>
        <div className="panel">
          <p className="panel-heading">{this.props.activeTab.title}</p>
          <p className="panel-body">{this.props.activeTab.content}</p>
          <BottomMenu />
        </div>
      </div>
    );
  }
}

export default Content;
