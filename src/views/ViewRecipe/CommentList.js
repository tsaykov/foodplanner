import React from 'react';
import axios from 'axios';
import Comment from './Comment';

class CommentList extends React.Component {

    state = {
      comments: [],
      label: "Коментари за тази рецепта"
    };
  
    async componentDidMount() {
        this.fetchComments();
    } ;  
   
    async fetchComments() {
      const recipeId = this.props.recipeId;
      console.log("loading comments");
      const resp = await axios.get(`https://f-newrecipe.azurewebsites.net/api/comments/${recipeId}`);
      
      this.setState({comments: resp.data.reverse()});
      document.getElementById("loadingComments").className = document.getElementById("loadingComments").className.replace( /(?:^|\s)loader(?!\S)/g , '' );
      console.log(document.getElementById("loadingComments").className); 
  
    };
  
    render() {
     return (
        <main>
            <br/>
            <div className="row limited" >
              <section className="column small-12 ">
                  <h3 id="loadingComments" className="none loader">Коментари за тази рецепта</h3>
                  {this.state.comments.map(comment => <Comment key={comment.id} {...comment}/>)}
              </section>
            </div>
            
        </main>
      );
    }	
  
  }

  export default CommentList;
  