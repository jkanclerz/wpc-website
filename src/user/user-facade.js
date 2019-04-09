import { AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { LoginProviderName } from '../env.js';

export default class AuthFacade {
    constructor(userPool, creds) {
        this.userPool = userPool;
        this.creds = creds;
    }

    handleLogin(loginRequest) {
        var authenticationDetails = new AuthenticationDetails({
            Username : loginRequest.username,
            Password : loginRequest.password
        });
        
        var cognitoUser = new CognitoUser({
            Username : loginRequest.username,
            Pool : this.userPool
        });
        
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                this.refreshCredentials()
            },
        
            onFailure: (err) => {
                alert(err);
            }
        });
    };

    handleRegister(registerUserRequest) {
        alert(`i am going to register ${registerUserRequest.username}`)
        
        this.userPool.signUp(
            registerUserRequest.username,
            registerUserRequest.password,
            [
                new CognitoUserAttribute({
                    Name: 'email',
                    Value: registerUserRequest.email
                }),
                new CognitoUserAttribute({
                    Name: 'name',
                    Value: registerUserRequest.name
                })
            ],
            null,
            (err, result) => {
                if (err) {
                    alert(err.message);
                    console.log(err);
                    return;
                }
                
                alert(`Hurray!!! user ${result.user.getUsername()} was registered`);
            }
        );
        
    }

    handleConfirm(confirmRequest) {
        const cognitoUser = new CognitoUser({
            Username: confirmRequest.username,
            Pool: this.userPool})
        
        cognitoUser.confirmRegistration(
            confirmRequest.code,
            true, 
            (err, result) => {
                if (err) {
                    alert(err);
                    return;
                }
                alert(result);
        });
    }

    getIdentityId() {
        return this.creds.identityId;
    }

    refreshCredentials()  {
        var cognitoUser = this.userPool.getCurrentUser();
    
        if (cognitoUser != null) {
            cognitoUser.getSession((err, result) => {
                if (result) {
                    this.creds.params.Logins = this.creds.params.Logins || {};
                    this.creds.params.Logins[LoginProviderName] = result.getIdToken().getJwtToken();
                }
            });
        }
        //call refresh method in order to authenticate user and get new temp credentials
        this.creds.refresh((error) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Successfully logged!');
            }
        });
    }
}
