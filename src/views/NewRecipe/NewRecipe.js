import React from 'react';
import Form from '@rjsf/material-ui';
import fields from 'react-jsonschema-form-extras';
import { Redirect } from 'react-router-dom';
import userprofile from '../../images/userProfile.png';
import { confirmAlert } from 'react-confirm-alert';
import "../../react-confirm-alert.css";

const formSchema = require('./JSONSchema.json');
const formUI = require('./uiSchema.json');
const formData = require('./formData.json');


class App extends React.Component {
  constructor(props) {
      super(props);

      this.onSubmit = async ({formData}) => {
        try { document.getElementById("submitButton").className += " hidden"; } catch {}
        try { document.getElementById("loader").className = document.getElementById("loader").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}
        try { document.getElementById("failMsg").className += " hidden"; } catch {}

        formData.authorId = this.props.authcontext.account.idTokenClaims.emails[0];
        formData.author = this.props.authcontext.account.name;

        console.log("Posting", JSON.stringify(formData));
      
        fetch("https://f-newrecipe.azurewebsites.net/api/AddNewRecipe?code=YamaaW8QhSCmOqWPg2dDL5cnpPeD15FWHvMStwuxGhmNulBnm9NVvQ==", {
              "method": "POST",
              "headers": {
                "content-type": "application/json",
                "accept": "application/json"
              },
              "body": JSON.stringify({
                formData
              })
        })
        .then(response => response.json())
        .then(() =>{
              try { document.getElementById("loader").className += " hidden"; } catch {}
              try { document.getElementById("submitButton").className = document.getElementById("submitButton").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
              this.setRedirectOnSuccess()

        })
        .catch(err => {
          console.log(err);
          try { document.getElementById("failMsg").className = document.getElementById("failMsg").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}
          try { document.getElementById("loader").className += " hidden"; } catch {}
          try { document.getElementById("submitButton").className = document.getElementById("submitButton").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}

          confirmAlert({
            title: '???????????????? ????????????',
            message: '???????????????????? ???? ?????????????? ???? ???????? ??????????????.',
            buttons: [
              {
                label: '??????????????'
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
          });
        })        
     }
 
  }
  state = { redirect: null };

  setRedirectOnSuccess() {
     this.setState({ redirect: "/MyRecipes" });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    var form;
    if (this.props.authcontext.isAuthenticated) {
      form =  <div className="row limitedthin">
            <h1>?????????????????? ???? ???????? ??????????????</h1>
            <Form schema={formSchema} uiSchema={formUI} formData={formData} fields={fields} onSubmit={this.onSubmit} >
              <button className="SubmitButton" id="submitButton" type="submit">??????????????????</button>
            </Form>
            <h5 className="failMsg hidden" id="failMsg">???????????????????????? ???? ???????? ??????????????.</h5>
            <h1 className="loader hidden margintop" id="loader" >???????? ??????????????????...</h1>
      </div>

    } else {
      form = <> 
        <div className="row limited unauth">
            <h2>???????????? ?? ???????????????????????? ???? ???? ????????????????????</h2>
        </div>
        <div className="row limited unauth">
            <div id="userProfileLeft" className="column small-12" onClick={() => this.props.authcontext.onSignIn()}>
                <div id="userName">????????</div>
                <div id="userImageHolder"><img src={userprofile} alt="????????????" /></div>
            </div>
        </div>
      </>
    }

    return(
      <main>
         { form }
      </main>
    )
  }
  
}


const NewRecipe = props => {
  
  return (
    <App authcontext={props.authcontext} />
  );
};


export default NewRecipe;


