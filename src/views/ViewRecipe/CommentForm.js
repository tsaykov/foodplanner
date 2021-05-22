import React from 'react';
import Form from '@rjsf/material-ui';
import CommentList from './CommentList';
import Rating from 'material-ui-rating';

const formSchema = require('./JSONSchema.json');
const formUI = require('./uiSchema.json');


class CommentForm extends React.Component {
    constructor(props) {
      super(props);
      const recipeId = this.props.recipeId;
      //console.log(recipeId);
      let refreshGuid = Math.random();
  
      this.onChangeRating = (newValue) => { 
          this.setState({ ratingValue: newValue });
      }
  
      this.onSubmit = async ({formData}) => {
        if (this.state.loading) { return; }
  
        if (!document.getElementById("root_comment").value) {
          console.log("no data to submit");
          //console.log(details);
  
          var elements = document.getElementsByClassName('MuiTypography-colorTextSecondary');
          for (var i in elements) {
            if (elements.hasOwnProperty(i)) {
              elements[i].style.color = 'red';
              elements[i].style.opacity = 1;
              elements[i].style.fontWeight = 800;
            }
          }
          
        } else {
          this.setState({ loading: true });        
  
          document.getElementById("submitButton").className += " loader";
  
          var elements = document.getElementsByClassName('MuiTypography-colorTextSecondary');
          for (var i in elements) {
            if (elements.hasOwnProperty(i)) {
              elements[i].style.color = 'black';
              elements[i].style.opacity = 0.54;
              elements[i].style.fontWeight = 400;
            }
          }
          
          let author;
          try { author = this.props.authcontext.account.name; }
          catch { author = "anonymous"; }

          let authorname;
          try { authorname = this.props.authcontext.account.idTokenClaims.emails[0]; }
          catch { authorname = "anonymous"; }
          
          var fData = `{ author: "${author}", username: "${authorname}", recipeId: "${recipeId}", "rating": "${this.state.ratingValue}", "text": "${ document.getElementById("root_comment").value}" }`;
          console.log("Posting", fData);
          document.getElementById("root_comment").disabled = true;
  
          fetch("https://f-newrecipe.azurewebsites.net/api/AddComment?code=XLuvaPKoxnL1s4BNzxQrkYigRfCBfC7n53KYWta8fl/Wp/ETqoRY2w==", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
                },
                "body": fData
              })
              .then(response => response.json())
              .then(response => {
                console.log(response)
              }).then((response) =>{
  
                console.log("Comment posted."); 
                this.setState({ commentsListState: Math.random() });    
                console.log(this.state.commentsListState); 
              })
              
          .catch(err => {
              console.log('Exception posting comment.. ');
              console.log(err);        
  
          })  
          .finally( () => {
              this.setState({ loading: false });
              document.getElementById("submitButton").className = document.getElementById("submitButton").className.replace( /(?:^|\s)loader(?!\S)/g , '' )
              document.getElementById("root_comment").value = "";
              document.getElementById("root_comment").disabled = false;
  
          })
          }
      }    
    }
      
    state = {
          loading: false,
          ratingValue: 3,
          commentsListState: 1
    };
  
  
    render() {
        const { loading } = this.state;

        var form;
        if (this.props.authcontext.isAuthenticated) {
          form =  <Form schema={formSchema} uiSchema={formUI}  onSubmit={this.onSubmit} >
              <Rating 
                  name="simple-controlled"
                  value={this.state.ratingValue}
                  onChange={this.onChangeRating}
              />

              <button 
                  id="submitButton" 
                  className="submitButton" 
                  type="submit" >Въвеждане
              </button>

          </Form>;
  
        } else {
          form = <> <br/> <p>Влезте в приложението за да оставите коментар</p> </>
        }
       
        return (   
        <>      
          <div className="row limited">
            <section className="column small-12">
              <hr></hr>
              <h4>Коментари</h4>   
  
               { form }

            </section> 
          </div>  
          <CommentList  key={this.state.commentsListState}  recipeId={this.props.recipeId}/>
        </> );
    }
  }

  export default CommentForm;