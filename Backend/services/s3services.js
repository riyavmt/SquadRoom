const AWS = require("aws-sdk");

async function uploadToS3(data,fileName){
    const BUCKET = 'squadroom';
    const IAM_USER_KEY = process.env.IAM_ACCESSKEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRETKEY;
    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY,
    })
    let params ={
        Bucket : BUCKET,
        Key:fileName,
        Body: data.buffer,
        ACL: 'public-read'
      }
      return new Promise((resolve,reject)=>{
        s3Bucket.upload(params , (err,res) =>{
          if(err) reject(err);
          else {
            console.log(res);
            resolve(res.Location);
          }
        })
      })
     }

     module.exports= uploadToS3;