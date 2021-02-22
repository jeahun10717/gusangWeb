const multer = require('@koa/multer');
const init = require('./init');

const bucket = 'jeahun-test';
const s3_newsale_folder = 'test';

exports.upload = ()=>{
  return multer({
    storage: init.getStorage(bucket, s3_newsale_folder)
  });
}

exports.delete = (key)=>{
  init.delete(bucket, key);
}
