import React from 'react';
import folderImg from '../imgs/folder.png';
import analysisImg from '../imgs/analysis.png';
import saveImg from '../imgs/save.png';

function ImgButton(props) {
  return (
    <button className="left-img-buttons" id={props.id}>
      <img style={{ width: '50px', height: '50px' }} src={props.imgSrc} alt={props.alt}></img>
    </button>
  );
}

function LeftMenu() {
  return (
    <div className="left-menu">
      <ImgButton id="view-files" imgSrc={folderImg} />
      <ImgButton id="data-analysis" imgSrc={analysisImg} />
      <ImgButton id="save" imgSrc={saveImg} />
      <button id="keyboard" className="keyboard">
        See Keyboard
      </button>
    </div>
  );
}

export default LeftMenu;
