import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

import {poolData, region, bucketRegion, bucketName, IdentityPoolId, LoginProviderName} from './env'
import AuthFacade from './user/user-facade';
import StorageFacade from './storage/storage-facade';

const userPool = new CognitoUserPool(poolData);
const creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
});

const auth = new AuthFacade(userPool, creds);

AWS.config.update({
    region: region,
    credentials: creds,
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName},
    region: bucketRegion
});

const storage = new StorageFacade(s3, auth)

document.getElementById('testS3').addEventListener('click', () => {
    storage.listAll();
})

document.getElementById('testUpload').addEventListener('click', () => {
    auth.refreshCredentials();
    const files = document.getElementById('files').files;

    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    storage.uploadFile(
        file,
        (result) => {
            const liElement = document.createElement('li');
            liElement.innerHTML = result.key;

            document.querySelector('#photoList')
                .appendChild(liElement);

            console.log(result);
        },
        (currentPorgress) => {
            console.log(`i am ${currentPorgress} of 100 done`);
        }
    );
})

const registerUserRequest = {
    username: 'kanclerj-test1',
    password: '123qwehahahaha',
    email: 'j.a.k.u.b.k.a.n.c.l.e.rz+test1@gmail.com',
    name: 'Wine The Pooh'
}

const loginRequest = {
    username: registerUserRequest.username,
    password: registerUserRequest.password
}


const loginBtn = document.getElementById('testLogin');
loginBtn.addEventListener('click', () => {
    auth.handleLogin(loginRequest);
});

const registerBtn = document.getElementById('testRegister');
registerBtn.addEventListener('click', () => {
    auth.handleRegister(registerUserRequest);
})

const confirmBtn = document.getElementById('testConfirm');
confirmBtn.addEventListener('click', () => {
    auth.handleConfirm({
        username: registerUserRequest.username,
        code: '1234567'
    });
})



document.querySelector('#testRegister').addEventListener('click', () => {
    const registerRequest = Array.from(document.querySelector('form'))
        .map((i) => { return {v: i.value, k: i.getAttribute('name')}})
        .reduce((result, current) => Object.assign(result, current));

    console.log(registerRequest);

})