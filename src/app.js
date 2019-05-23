import './styles.scss';

import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

import {poolData, region, bucketRegion, bucketName, IdentityPoolId, LoginProviderName} from './env'
import AuthFacade from './user/user-facade';

import React from 'react';
import ReactDOM from 'react-dom';
import NavbarComponent from './comonents/navbar'; 
import PopUpComponent from './comonents/popup/popup'; 

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {modal: {show: false}}
    }

    toggleModal() {
        this.setState(...this.state, {
            modal: {show: !this.state.modal.show}
        });
    }

    render() {
        return (
            <div>
                <NavbarComponent handleRegister={() => {this.toggleModal()}}/>
                <PopUpComponent toggleModal={() => this.toggleModal()} show={this.state.modal.show} />
                <span>
                    Hello, React!
                </span>
            </div>
        )
    }
    
};
 
ReactDOM.render(<App />, document.getElementById('root'));

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
