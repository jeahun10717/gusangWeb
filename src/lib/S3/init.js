const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');
const randomString = require('random-string');

const { AWS_S3_KEY, AWS_S3_SECRET, AWS_S3_REGION } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_S3_KEY,
  secretAccessKey: AWS_S3_SECRET,
  region: AWS_S3_REGION,
});

//TODO:밑의 소스에서 extention 으로 확장자 처리하면 됨
exports.getStorage = (bucket, folder)=>{
  return multerS3({
    s3: s3,
    bucket,
    key: function(req, file, cb){
      let extension = path.extname(file.originalname);
      cb(null, `${folder}/${randomString({length:16})+Date.now()+extension}`);
    },
    acl: 'public-read-write'
  });
}

exports.delete = (Bucket, Key) =>{
  s3.deleteObject({
    Bucket,
    Key
  }, function(err, data){
    if(err) console.log(err, err.stack);
    // else console.log(data); // {}
  });
}
