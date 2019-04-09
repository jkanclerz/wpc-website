import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

import {poolData, region, bucketRegion, bucketName, IdentityPoolId, LoginProviderName} from './env'
import AuthFacade from './user/user-facade';

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

const registerUserRequest = {
    username: '',
    password: '',
    email: '',
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
