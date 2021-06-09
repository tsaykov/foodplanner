import React from 'react';
import Form from '@rjsf/material-ui';
import fields from 'react-jsonschema-form-extras';
import { Redirect } from 'react-router-dom';
import userprofile from '../../images/userProfile.png';
import { withRouter } from "react-router";
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { confirmAlert } from 'react-confirm-alert';
import "../../react-confirm-alert.css";

const formSchema = require('./JSONSchema.json');
const formUI = require('./uiSchema.json');


class App extends React.Component {
  constructor(props) {
      super(props);

      this.onSubmit = async ({formData}) => {
        try { document.getElementById("submitButton").className += " hidden"; } catch {}
        try { document.getElementById("loader").className = document.getElementById("loader").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}
        try { document.getElementById("failMsg").className += " hidden"; } catch {}

        formData.authorId = this.props.authcontext.account.idTokenClaims.emails[0];
        formData.author = this.props.authcontext.account.name;

        const toPost = this.state.recipe_data;
        toPost.instructions = this.state.rtevalue.toString('html');
        toPost.cookingTime  = formData.cookingTime;
        toPost.portions     = formData.portions;
        toPost.tags         = formData.tags;
        toPost.complexity   = formData.complexity;
        toPost.ingredients  = formData.ingredients;

        console.log("Posting", JSON.stringify(toPost));
             
        fetch(" UpdateRecipe?code=p4xJNWSRPhOnYfT90ay8PRavR1IT49JzF8di3FcxDCiy7WUfTFi3Ow==", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "accept": "application/json"
          },
          "body": JSON.stringify({
            toPost
          })
        })
        .then(() => {
          try { document.getElementById("loader").className += " hidden"; } catch {}
          try { document.getElementById("submitButton").className = document.getElementById("submitButton").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}
          this.setRedirectOnSuccess();
        })        
        .catch(err => {
          console.log(err);
          try { document.getElementById("failMsg").className = document.getElementById("failMsg").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}
          try { document.getElementById("loader").className += " hidden"; } catch {}
          try { document.getElementById("submitButton").className = document.getElementById("submitButton").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}

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
  state = { 
    redirect: null,
    fatalError: false,
    recipe_data: 'зареждане',
    recipe_title: "",
    recipe_data_original_instructions: "<i></i>",
    rtevalue: RichTextEditor.createEmptyValue()
  };

  setRedirectOnSuccess() {
     this.setState({ redirect: "/MyRecipes" });
  }

  async componentDidMount() {
    try {
      if (this.props.authcontext.isAuthenticated) {
        const resp = await axios.get(`https://f-newrecipe.azurewebsites.net/api/reciperaw/${this.props.id}?code=eyi8NJWkHnQtf5aGIWrJGAJJ1Kxgocf9cerGcRR4DV0w36xVJLXIdg==`);
        const recipe_data = resp.data[0];
        const recipe_data_original_instructions = resp.data[0].instructions;
        const rtevalue = RichTextEditor.createValueFromString(resp.data[0].instructions, 'html');
        this.setState({rtevalue: rtevalue})
        this.setState({recipe_data: recipe_data});
        if (typeof recipe_data_original_instructions !== 'undefined') {
          this.setState({recipe_data_original_instructions: recipe_data_original_instructions});
        }
        this.setState({ recipe_title: recipe_data.title, fatalError: false });
      }    
  
    }
    catch {
      this.setState({fatalError: true});
    }
    finally {
      try { document.getElementById("loader").className += " hidden"; } catch {}
      try { document.getElementById("editForm").className = document.getElementById("editForm").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ); } catch {}

    }
  }

  onRteChange = (rtevalue) => {
      this.setState({rtevalue});     
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    if (this.state.fatalError) {
      return <main className="headLabel">
          <div className="row limited" >
              <h1>Промяна на рецепта</h1>
          </div>
          <section className="column small-12"> </section>
          <div className="row limited unauth">
              <h5 className="warningMsg narrow small-12">❢ &nbsp;Възникна грешка при обработка на информацията. Моля, опитайте по-късно.</h5>
          </div>
      </main>;
    }

    var form;
    if (this.props.authcontext.isAuthenticated) {

      form = <div className="row limitedthin">
            <h1>{ this.state.recipe_title }</h1>
            <Form className="hidden" id="editForm" schema={formSchema} uiSchema={formUI} formData={this.state.recipe_data} fields={fields} onSubmit={this.onSubmit} >
              <h4>Инструкции</h4>

              <RichTextEditor id="instructions" value={ this.state.rtevalue } onChange={this.onRteChange} />
              <button class="SubmitButton" id="submitButton" type="submit">Запазване</button>
            </Form>
            <h5 className="failMsg hidden" id="failMsg">Обновяването не беше успешно.</h5>
            <h1 className="loader margintop" id="loader" >Моля изчакайте...</h1>
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


class EditRecipe extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
      console.log(this.props.match.params.id);

      return ( 
          <App id={this.props.match.params.id} authcontext={this.props.authcontext} />
      );
  }
};


export default withRouter(EditRecipe);

