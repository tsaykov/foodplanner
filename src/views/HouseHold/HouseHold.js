import React from 'react';
import Form from '@rjsf/material-ui';
import fields from 'react-jsonschema-form-extras';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import userprofile from '../../images/userProfile.png';
import { confirmAlert } from 'react-confirm-alert';
import "../../react-confirm-alert.css";

const formUI = require('./uiSchema.json');
const baseProducts = ["домат", "картоф", "морков", "лук", "чесън", "авокадо", "тиквичка", "патладжан", "сирене", "прясно мляко", "кисело мляко", "сметана", "какао", "рожков", "чия", "киноа", "черен пипер", "червен пипер", "портокал", "лимон", "ябълка", "колбаси", "телешко месо", "свинско месо", "пилешко месо", "риба", "пъстърва", "сьомга"];


class App extends React.Component {
  state = {
    fatalError: false,
    wasAuthenticated: "none",
    profile: 'зареждане'    
  };

  constructor(props) {
      super(props);
      this.onSubmit = async ({formData}) => {
        
        document.getElementById("submitButton").className += " hidden";      
        document.getElementById("successMsg").className += " hidden";      
        document.getElementById("failMsg").className += " hidden";      
        document.getElementById("loader").className = document.getElementById("loader").className.replace( /(?:^|\s)hidden(?!\S)/g , '' )

        formData.id = this.props.authcontext.account.idTokenClaims.emails[0];
        formData.username = this.props.authcontext.account.name;
        
        console.log("Posting", JSON.stringify(formData));
      
        fetch("https://f-newrecipe.azurewebsites.net/api/UpdateHousehold?code=ci0Ngb8CLjhkqCMUQ0dmMQmaGjECNjTMXOR1G768XUpGdaGaPBCmIg==", {
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
        .then(() => {
           try { document.getElementById("successMsg").className = document.getElementById("successMsg").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
           this.setState({fatalError: false});
          })
        .catch(err => {
          console.log(err);
          try { document.getElementById("failMsg").className = document.getElementById("failMsg").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}

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
        .finally( () => {
          try { document.getElementById("loader").className += " hidden"; } catch {}
          try { document.getElementById("submitButton").className = document.getElementById("submitButton").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
        })
      }

  }

  state = { redirect: null };
  
  async componentDidMount() {
    try {
      if (this.props.authcontext.isAuthenticated) {
        let email = this.props.authcontext.account.idTokenClaims.emails[0];
        const resp = await axios.get(`https://f-newrecipe.azurewebsites.net/api/id/${email}?code=rD41WEaD3mA7Sb5tf2lEq2Eeet/dvRnzZPlichbn7OUxHg2fIEmtOw==`);
        this.setState({profile: resp.data[0]});
        this.setState({wasAuthenticated: "yes"});
        try { document.getElementById("loader").className += " hidden"; } catch {}
        try { document.getElementById("householdForm").className = document.getElementById("householdForm").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
      } else {
        this.setState({wasAuthenticated: "wasNoUser"});
      }   
    }
    catch {
      this.setState({fatalError: true});
      try { document.getElementById("loader").className += " hidden"; } catch {}
      try { document.getElementById("householdForm").className = document.getElementById("householdForm").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
    }
  }


  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    if (this.state.fatalError) {
      return <main className="headLabel">
          <div className="row limited" >
              <h1>Домакинство</h1>
          </div>
          <section className="column small-12"> </section>
          <div className="row limited unauth">
              <h5 className="warningMsg narrow small-12">❢ &nbsp;Възникна грешка при обработка на информацията. Моля, опитайте по-късно.</h5>
          </div>
      </main>;
    }

    if (this.props.authcontext.isAuthenticated && this.state.wasAuthenticated == "wasNoUser" )
    {
      this.props.authcontext.onSignOut();
      return <></>;
    }

    let jsonSchema={
      properties: {
           
      preferences: {
        title: "Предпочитания",
        description: "Насоки какви рецепти да предлагаме",
        type: "object",
        properties: {

          complexity: {
            type: "string",
            title: "Сложност",
            description: "Ще избягваме по-сложни рецепти",
            enum: [
              "без предпочитания",
              "лесна",
              "средна",
              "трудна"
            ]
          },
          cookingTime: {
            type: "string",
            title: "Време за готвене (мин)",
            description: "Ще избягваме рецепти, които изискват повече от избраното време",
            enum: [ "без предпочитания",
              "10","20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120" ]

          },

          tags: {
            type: "array",
            title: "Видове рецепти",
            minItems: 1,
            items: {
              type: "string",
              enum: [ "закуска", "тестени", "десерти", "салати", "супи", "основни", "скара", "българска", "азиатска", "италианска", "интернационална" ]
            },
            uniqueItems: true
          }


        }
      },
      
        persons: {
          type: "array",
          minItems: 1,
          title: "Членове на домакинството",
          description: "Данни за хората, за които предлагаме рецепти",
          items: {
            type: "object",
            required: [
              "name"
            ],
            properties: {
              name: {
                type: "string",
                title: "Име"
              },
    
            likes: {
                type: "array",
                title: "Любими продукти",
                items: {
                  type: "string",
                  enum: baseProducts 
                },
                uniqueItems: true
              },
              
              dislikes: {
                type: "array",
                title: "Нежелани продукти",
                items: {
                  type: "string",
                  enum: baseProducts
                },
                uniqueItems: true
              }              
            }
          }
        }
      }
    }

    var form;

    if (this.props.authcontext.isAuthenticated) {
      form =  <div className="row limitedthin">
        <section className="column small-12 ">

          <Form className="hidden" id="householdForm" schema={jsonSchema} uiSchema={formUI} formData={this.state.profile} fields={fields} onSubmit={this.onSubmit} >
              <button className="SubmitButton" id="submitButton" type="submit">Запази</button>
          </Form>
          
          <h5 className="successMsg hidden" id="successMsg">Данните бяха обновени.</h5>
          <h5 className="failMsg hidden" id="failMsg">Обновяването не беше успешно.</h5>
          <h1 className="loader margintop" id="loader" >Моля изчакайте...</h1>
          
        </section>
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
      <main className="headLabel">

          <h1 className="onlyOnSmall paddingBottom">Домакинство</h1>
          
          { form }

      </main>
    )
  }  
}

const HouseHold = props => {
  return (
    <App authcontext={ props.authcontext } />
  );
};

export default HouseHold;
