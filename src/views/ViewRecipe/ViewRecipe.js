import React from 'react';
//import { useParams } from 'react-router-dom'
import { withRouter } from "react-router";
import App from './App';

class ViewRecipe extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.match.params.id);
        console.log(this.props.authcontext);

        return ( 
            <App id={this.props.match.params.id} authcontext={this.props.authcontext} />
        );
    }
};


export default withRouter(ViewRecipe);
