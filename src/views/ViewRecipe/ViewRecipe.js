import React from 'react';
import { withRouter } from "react-router";
import App from './App';

class ViewRecipe extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( 
            <App id={this.props.match.params.id} authcontext={this.props.authcontext} />
        );
    }
};

export default withRouter(ViewRecipe);
