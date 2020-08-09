import React, { useState, useRef, useEffect } from 'react';

import imgPath from '../imgs/analysis.png';

function Canvas(props) {
  const [filePath, setFilePath] = useState(props.filePath);
  const [parentSize, setParentSize] = useState({ x: 1, y: 1 });
  const [refs] = useState({ canvasRef: useRef(), divRef: useRef() });
  const [canvasInfo, setCanvasInfo] = useState({
    canvas: null,
    ctx: null,
    img: new Image(),
    ratio: 1,
    imgSize: { w: 0, h: 0 },
  });

  let scaleFactor = 1.05;

  // var canInfo = {
  //   canvas: null,
  //   ctx: null,
  //   img: new Image(),
  //   ratio: 1,
  //   imgSize: { w: 0, h: 0 },
  // };

  // all rendering
  useEffect(() => {
    const { canvasRef, divRef } = refs;
    var { canvas, ctx, img, ratio, imgSize } = canvasInfo;
    setFilePath(props.filePath);

    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    trackTransforms(ctx);

    //img.src = filePath;
    img.src = imgPath;

    var w = divRef.current.offsetWidth;
    var h = divRef.current.offsetHeight;
    parentSize.x = w;
    parentSize.y = h;
    canvas.width = w;
    canvas.height = h;

    img.addEventListener(
      'load',
      function () {
        ratio = this.height / this.width;

        if (ratio < 1.0) {
          this.width = w;
          this.height = w * ratio;
          if (this.height > h) {
            this.height = h;
            this.width = h * (1 / ratio);
          }
        } else if (ratio === 1) {
          this.width = w <= h ? w : h;
          this.height = this.width;
        } else {
          this.height = h;
          this.width = h * (1 / ratio);
          if (this.width > w) {
            this.width = w;
            this.height = w * ratio;
          }
        }
        imgSize.w = this.width;
        imgSize.h = this.height;
        redraw();
      },
      false
    );

    function redraw() {
      // Clear the entire canvas
      var p1 = ctx.transformedPoint(0, 0);
      var p2 = ctx.transformedPoint(canvas.width, canvas.height);
      ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.drawImage(
        img,
        (parentSize.x - imgSize.w) / 2,
        (parentSize.y - imgSize.h) / 2,
        imgSize.w,
        imgSize.h
      );
    }

    var lastX = canvas.width / 2,
      lastY = canvas.height / 2;

    var dragStart;

    // the moment when mouse is clicked
    var mouseDown = function (evt) {
      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
        'none';
      lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
      lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
      dragStart = ctx.transformedPoint(lastX, lastY);
    };

    // the moment when mouse is moving after click
    var mouseMove = function (evt) {
      lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
      lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
      if (dragStart) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
        redraw();
      }
    };

    // the moment when click event is finished
    var mouseUp = function (evt) {
      dragStart = null;
    };

    // zoom in & out
    var zoom = function (clicks) {
      var pt = ctx.transformedPoint(lastX, lastY);
      ctx.translate(pt.x, pt.y);
      var factor = Math.pow(scaleFactor, clicks);
      ctx.scale(factor, factor);
      ctx.translate(-pt.x, -pt.y);
      redraw();
    };

    // scroll (up: zoom-in) (down: zoom-out)
    var handleScroll = function (evt) {
      var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
      //if (delta) zoom(delta);
      if (delta > 0) zoom(1);
      else zoom(-1);
      return evt.preventDefault() && false;
    };

    function getSize() {
      setParentSize({ x: divRef.current.offsetWidth, y: divRef.current.offsetHeight });
    }

    // canInfo = {
    //   canvas,
    //   ctx,
    //   img,
    //   ratio,
    //   imgSize,
    // };

    window.addEventListener('resize', getSize);
    // add moving events
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    // add scroll events
    canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('mousewheel', handleScroll, false);

    return () => {
      window.removeEventListener('resize', getSize);
      canvas.removeEventListener('mousedown', mouseDown, false);
      canvas.removeEventListener('mousemove', mouseMove, false);
      canvas.removeEventListener('mouseup', mouseUp, false);
      canvas.removeEventListener('DOMMouseScroll', handleScroll, false);
      canvas.removeEventListener('mousewheel', handleScroll, false);
    };
  }, [refs, canvasInfo, props.filePath, parentSize.x, parentSize.y, scaleFactor]);

  // useEffect(() => {
  //   setCanvasInfo((canvasInfo) => Object.assign(canvasInfo, canInfo));
  // }, []);

  return (
    <div className="img-div" ref={refs.divRef} id={props.activeTab.dataInfo.imgInfoId}>
      <canvas ref={refs.canvasRef} id={props.activeTab.dataInfo.imgInfoId}></canvas>
    </div>
  );
}

function trackTransforms(ctx) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function () {
    return xform;
  };

  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function () {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };

  var restore = ctx.restore;
  ctx.restore = function () {
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };

  var scale = ctx.scale;
  ctx.scale = function (sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(ctx, sx, sy);
  };

  var rotate = ctx.rotate;
  ctx.rotate = function (radians) {
    xform = xform.rotate((radians * 180) / Math.PI);
    return rotate.call(ctx, radians);
  };

  var translate = ctx.translate;
  ctx.translate = function (dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };

  var transform = ctx.transform;
  ctx.transform = function (a, b, c, d, e, f) {
    var m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };

  var setTransform = ctx.setTransform;
  ctx.setTransform = function (a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(ctx, a, b, c, d, e, f);
  };

  var pt = svg.createSVGPoint();
  ctx.transformedPoint = function (x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  };
}

export default Canvas;
