const { classificationProjectManager } = require('../project_managers/classification-manager.js');
const { detectionProjectManager } = require('../project_managers/detection-manager.js');

function setProjectManager(event, taskId) {
  if (taskId == 'IC')
    // Image classification
    global.projectManager = new classificationProjectManager();
  else if (taskId == 'OD')
    // Object detection
    global.projectManager = new detectionProjectManager();
  else if (taskId == 'SS')
    // Symantic segmentation
    console.log('SS');
  else if (taskId == 'OCR')
    // Optical character recognition
    console.log('OCR');
  event.returnValue = 'Set project manager -Done';
}

module.exports = setProjectManager;
