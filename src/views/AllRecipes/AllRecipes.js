import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';


const RecipeList = (props) => (
  <div className="row limited">
      {props.recipes.slice(props.from, props.to).map(recipe => <Recipe key={recipe.id} {...recipe}/>)}
	</div>
);

class Recipe extends React.Component {
	render() {
  	const recipe = this.props;
  	return (    
        <NavLink to={'./viewrecipe/'+recipe.id} className="column clickable small-12 medium-6 labeled imageDiv"> 
            <h6>{recipe.title}</h6>
            <img src={"https://foodplannerweb.blob.core.windows.net/images/"+recipe.imageName}  alt="" /> 
            <p>{recipe.author}</p>
        </NavLink>  

    );
  }
}

class App extends React.Component {
  state = {
    userName: '',
    recipes: [],
    fatalError: false,
    pageStart: 0,
    pageEnd: 0,
    prevClass: "disabledLink",
    nextClass: ""
  };

  async componentDidMount() {
    try {
      const resp = await axios.get(`https://f-newrecipe.azurewebsites.net/api/ListRecipesAll?code=WDRZETDxHqWv0yblVrXaHGV6b/Z0tosdHi96dwOFaYWiOiMt14M9OA==`);
      this.setState({recipes: resp.data, fatalError: false});

      if (resp.data.length == 0) { this.setState({pageStart: 0, pageEnd: 0, prevClass: "disabledLink", nextClass: "disabledLink" }); }
      else if (resp.data.length < 5) { this.setState({pageStart: 1, pageEnd: resp.data.length, prevClass: "disabledLink", nextClass: "disabledLink" }); }
      else { this.setState({pageStart: 1, pageEnd: 4, prevClass: "disabledLink", nextClass: "" }); }

    }
    catch {
      this.setState({fatalError: true});
    }
    finally {
      try { document.getElementById("loadingData").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' ) } catch {}
      try { document.getElementById("pageLinkHolder").className = document.getElementById("pageLinkHolder").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
    }
     
  }

	render() {
    if (this.state.fatalError) {
      return <main className="headLabel">
          <div className="row limited" >
              <h1>Всички рецепти</h1>
          </div>
          <section className="column small-12"> </section>
          <div className="row limited unauth">
              <h5 className="warningMsg narrow small-12">❢ &nbsp;Възникна грешка при обработка на информацията. Моля, опитайте по-късно.</h5>
          </div>
      </main>;
    }

    const handlePrev = (e) => {

      e.preventDefault();
      
      let max = this.state.recipes.length;
      if (max==0) { return; }
      
      let start = this.state.pageStart;
      let end = this.state.pageEnd;
      
      if ( start < 4 ) {
        start = 1;
      } else {
        start = start - 4;
      }
      end = start + 3;
      if ( end > max ) end = max;
      
      this.setState({pageStart: start});
      this.setState({pageEnd: end});

      if (start == 1) {
        this.setState({prevClass: "disabledLink"});
      } else {
        this.setState({prevClass: ""});
      }

      if (end > max - 1) {
        this.setState({nextClass: "disabledLink"});
      } else {
        this.setState({nextClass: ""});
      }

    };
    
    const handleNext = (e) => {

      e.preventDefault();
      
      let max = this.state.recipes.length;
      if (max==0) { return; }
      
      let start = this.state.pageStart;
      let end = this.state.pageEnd;

      if ( start + 4 > max) {
          return;
      }
      start = start + 4; 
      end = start + 3;
      if ( end > max ) end = max;
      
      this.setState({pageStart: start});
      this.setState({pageEnd: end});
      
      if (start == 1) {
        this.setState({prevClass: "disabledLink"});
      } else {
        this.setState({prevClass: ""});
      }

      if (end > max - 1) {
        this.setState({nextClass: "disabledLink"});
      } else {
        this.setState({nextClass: ""});
      }

    };
    
    return (
      <main>

        <div className="row limited">
          <section className="column small-12">
              <h1 id="loadingData" className="loader">{this.props.title}</h1>
          </section>
        </div>

        <RecipeList recipes={this.state.recipes} from={this.state.pageStart - 1} to={this.state.pageEnd} />
        
        <div id="pageLinkHolder" className="row limited pageLinkHolder hidden">
          <div className="column small-2 pageLabel ">
              <h5>{this.state.pageStart} &nbsp;...&nbsp; {this.state.pageEnd}</h5>
          </div>
          <NavLink to='' className={"column navBox small-1 pageLink " + this.state.prevClass } onClick={handlePrev}>
              <h5>Предишна</h5>
          </NavLink>
          <NavLink to='' className={"column navBox small-1 pageLink " + this.state.nextClass } onClick={handleNext}>
              <h5>Следваща</h5>
          </NavLink>

        </div>

    	</main>
    );
  }	
}


const AllRecipes = props => {
  
  return (
    <App title="Всички рецепти" />
  );
};

export default AllRecipes;