import React, { Component } from 'react';
import BreadCrumb from './bread-crumb';

class Content extends Component {
  render() {
    return (
      <div className="tab-contents">
        <BreadCrumb filePath={this.props.filePath} breadClick={this.props.breadClick}></BreadCrumb>
        <section className="panel">
          <p className="panel-heading">{this.props.activeTab.title}</p>
          <p className="panel-body">{this.props.activeTab.content}</p>
        </section>
      </div>
    );
  }
}

export default Content;
