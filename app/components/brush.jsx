import React, { useState, createRef, useEffect } from 'react';

function Brush(props) {
  let canvas, ctx;
  let canvasRef = createRef();
  let pos = { drawable: false, X: -1, Y: -1 };

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', initDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', finishDraw);
    canvas.addEventListener('mouseout', finishDraw);
  }, []);

  function initDraw(e) {
    ctx.beginPath();
    pos = { drawable: true, ...getPosition(e) };
    ctx.moveTo(pos.X, pos.Y);
  }

  function draw(e) {
    if (pos.drawable) {
      pos = { ...pos, ...getPosition(e) };
      ctx.lineTo(pos.X, pos.Y);
      ctx.stroke();
    }
  }

  function finishDraw() {
    pos = { drawable: false, X: -1, Y: -1 };
  }

  function getPosition(e) {
    return { X: e.offsetX, Y: e.offsetY };
  }

  return <canvas ref={canvasRef} style={{ width: '400', height: '300' }}></canvas>;
}

export default Brush;
