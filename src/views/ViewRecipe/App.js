import React from 'react';
import axios from 'axios';
import RecipeDetails from './RecipeDetails';

class App extends React.Component {
    state = {
      details: '',
      title: 'зареждане...',
    };
  
    async componentDidMount() {
      const resp = await axios.get(`https://f-newrecipe.azurewebsites.net/api/recipe/${this.props.id}?code=Y20EqwJz8GDjlartA3/T2b6QQQlNtnOxwaQdoXeOVs3opAOzWblAug==`);
      this.setState({details: resp.data[0]});
      this.setState({title: resp.data[0].title});
      document.getElementById("loadingData").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' )
    }    
  
    render() {
        return (
        <main>

          <div className="row limited">
            <section className="column small-12 medium-6 ">
                <h1 id="loadingData" className="loader">{this.state.title}</h1>
            </section>
          </div>
          <RecipeDetails details={this.state.details} authcontext={ this.props.authcontext } />
                 
        </main>
      );
    }	
}

export default App;
