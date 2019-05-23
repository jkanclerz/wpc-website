import React from 'react';
 
export default class NavbarComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (    
            <nav className="navbar navbar-light bg-light">
                <a className="navbar-brand" href="#">
                    My app
                </a>
                <button onClick={this.props.handleRegister}>register</button>
            </nav>
        )
    }
};

