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
      
        fetch("https://f-newrecipe.azurewebsites.net/api/HttpTrigger1?code=8iSn3GTpplNhxRQMPUJ3j9N82FD2HQbWkUTi3G9eIKiya7aY30dANQ==", {
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
            title: 'Възникна грешка',
            message: 'Вписването на данните не беше успешно.',
            buttons: [
              {
                label: 'Затвори'
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
            <h1>Въвеждане на нова рецепта</h1>
            <Form schema={formSchema} uiSchema={formUI} formData={formData} fields={fields} onSubmit={this.onSubmit} >
              <button className="SubmitButton" id="submitButton" type="submit">Въвеждане</button>
            </Form>
            <h5 className="failMsg hidden" id="failMsg">Обновяването не беше успешно.</h5>
            <h1 className="loader hidden margintop" id="loader" >Моля изчакайте...</h1>
      </div>

    } else {
      form = <> 
        <div className="row limited unauth">
            <h2>Влезте в приложението за да продължите</h2>
        </div>
        <div className="row limited unauth">
            <div id="userProfileLeft" className="column small-12" onClick={() => this.props.authcontext.onSignIn()}>
                <div id="userName">Вход</div>
                <div id="userImageHolder"><img src={userprofile} alt="Профил" /></div>
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


