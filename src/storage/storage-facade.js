export default class StorageFacade {
    constructor(s3, auth) {
        this.s3 = s3;
        this.auth = auth;
    }

    listAll() {
        this.s3.listObjects({Delimiter: '/'}, function(err, data) {
            if (err) {
              return alert('There was an error listing your bucket: ' + err.message);
            } else {
              console.log(data);
            }
          });
    }

    uploadFile(file, successCallback, progresCallback) {
        const userDirId = this.auth.getIdentityId();

        var fileName = file.name;
        this.s3.upload({
            Key: 'uek-krakow/' + userDirId + `/${fileName}`,
            Body: file,
        })
        .on('httpUploadProgress', (evt) => {
            let progress = Math.round(evt.loaded / evt.total * 100);
            if (progresCallback) {
                progresCallback(process);
            }
        
            console.log(`current progress ${progress}%`);
        })
        .send((err, data) => {
            if (err) {
                return alert('There was an error uploading your photo: ', err.message);
            }
            
            successCallback(data);
            alert('Successfully uploaded photo.');
        });
    }
}