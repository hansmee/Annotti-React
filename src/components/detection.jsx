import React from 'react';
import '../styles/main.less';
import LeftMenu from './left-menu';
import WorkingArea from './working-area';

function Detection() {
  return (
    <div className="container">
      <LeftMenu></LeftMenu>
      <WorkingArea task="OD"></WorkingArea>
    </div>
  );
}

export default Detection;
