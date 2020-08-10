import React, { Component } from 'react';

class Tab extends Component {
  render() {
    return (
      <li onClick={this.props.handleClick} className={this.props.isActive ? 'active' : null}>
        <a href="#!" title={this.props.data.title}>
          {this.props.data.title}
        </a>
        <button className="close" type="button" title="Remove page" onClick={this.props.removeTab}>
          ×
        </button>
      </li>
    );
  }
}

class Tabs extends Component {
  wheelScroll(e) {
    document.getElementsByClassName('nav')[0].scrollLeft += e.deltaY;
  }

  render() {
    return (
      <ul className="nav nav-tabs" onWheel={(e) => this.wheelScroll(e)}>
        {this.props.tabData.map(
          function (tab, idx) {
            return (
              <Tab
                key={idx}
                data={tab}
                isActive={this.props.activeTab === tab}
                handleClick={this.props.changeTab.bind(this, tab)}
                removeTab={this.props.removeTab.bind(this, tab)}
              />
            );
          }.bind(this)
        )}
      </ul>
    );
  }
}

export default Tabs;
