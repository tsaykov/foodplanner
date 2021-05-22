import React from 'react';
import CommentForm from './CommentForm';
import mailIcon from '../../images/mail.svg';
import { NavLink } from 'react-router-dom';

class RecipeDetails extends React.Component {
    state = {
        sent: false,
    }

    constructor(props) {
        super(props);
        this.sendIngredients = async (e) => {            
            e.preventDefault();
            this.setState({sent: true})

            fetch("https://prod-150.westeurope.logic.azure.com:443/workflows/ce718a36915b4320af21a3223ea092d5/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lFjRs2Suo6voZqquIl75wO1sW3-turFVufFQtzhYnkw&id=" +  this.props.details.id + "&r=" + this.props.authcontext.account.idTokenClaims.emails[0], {
                "method": "GET"
                })
                .then(response => {
                console.log(response)
                }).then((response) =>{

                console.log("Initiated email send."); 
                })
                
            .catch(err => {
                console.log('Exception sending ingredients.. ');
                console.log(err);        

            })  
            .finally( () => {
                console.log('Finally.. ');
            })

            console.log("send");
        }   
 
  }
  
  render() {
        const details = this.props.details;
        const sent = this.props.sent;

        if ( details == undefined ) {
            return <div />;
        }

        if ( details.title == undefined ) {
            return <div />;
        }

        var postTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
        postTime.setUTCSeconds(details._ts);
        // console.log(details.ingredients);
        console.log(details);
        
        var sendMailLink;
        if (this.state.sent) {
            console.log("an email was already sent");
            sendMailLink = <span><i>Изпратен имейл</i></span>;
        
        } 
        else if (this.props.authcontext.isAuthenticated) {
          sendMailLink = <NavLink to="" onClick={this.sendIngredients} id="sendMailLink">
                <img id="sendMailLinkText" src={mailIcon} alt="изпрати като имейл" />изпрати
          </NavLink>;
    
        } else {
          sendMailLink = <> </>;
        }

        return (   
        <> 
            <div className="row limited" >

            <section className="column small-12 medium-7 display">
                <img src={"https://foodplannerweb.blob.core.windows.net/images/"+details.imageName}  alt={details.title} /> 
                
                <div dangerouslySetInnerHTML={{ __html: details.instructions }}></div> 
            </section>

            <section className="column small-12 medium-4 display">
                <div className="authorBlock"> 
                    <span className="date">от &nbsp;</span><span className="authorName"><strong>{details.author}</strong></span>
                    <span className="date">,&nbsp; {postTime.toLocaleString()}</span>
                </div>
                <h6>Категория</h6> 
                <h5>{            
                    details.tags
                    .map(item => <span>{item}</span>)
                    .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null)          
                }</h5>

                <h6>Сложност</h6> 
                <h5>{details.complexity}</h5>

                <h6>Време за готвене</h6> 
                <h5>{details.cookingTime} минути</h5>

                <h6>Порции</h6> 
                <h5>{details.portions}</h5>

                <h6>Съставки</h6> 
                <table>
                     {details.ingredients.map((item, i) => <tr> <td>{item.title}</td> <td>{item.quantity} {item.type}</td> </tr>)}
                </table>

                { sendMailLink }          

            </section>

        </div>
        <CommentForm recipeId={details.id} authcontext={this.props.authcontext} />
        
        </> );
  }
}


export default RecipeDetails;