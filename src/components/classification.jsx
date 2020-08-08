import React from 'react';
import '../styles/main.less';
import LeftMenu from './left-menu';
import WorkingArea from './working-area';

function Classification() {
  return (
    <div className="main-container">
      <LeftMenu></LeftMenu>
      <WorkingArea task="IC"></WorkingArea>
    </div>
  );
}

export default Classification;
