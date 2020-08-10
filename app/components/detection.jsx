import React from 'react';
import LeftMenu from './left-menu';
import WorkingArea from './working-area';

function Detection() {
  return (
    <div className="main-container">
      <LeftMenu></LeftMenu>
      <WorkingArea task="OD"></WorkingArea>
    </div>
  );
}

export default Detection;
