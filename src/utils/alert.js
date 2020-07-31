function alertError(msg, detail){
  const {remote} = window.require('electron')
  remote.dialog.showMessageBox({
    type:'error',
    title:'Error',
    message: msg,
    detail: detail
  })
}
  
module.exports = { alertError }
