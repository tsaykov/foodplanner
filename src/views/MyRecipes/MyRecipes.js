
import React from 'react';
import userprofile from '../../images/userProfile.png';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import "../../react-confirm-alert.css";


class RecipeList extends React.Component {
  state = {
    toggleRerender: true
  };
  
  constructor(props) {
    super(props);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }
  
  rerenderParentCallback() {
    this.props.rerenderParentCallback();
  }

  render() {
    return <div className="row limited">
      {this.props.recipes.slice(this.props.from, this.props.to).map(recipe => <Recipe rerenderParentCallback={this.rerenderParentCallback}  key={recipe.id} {...recipe}/>)}
    </div>
  }
}


class Recipe extends React.Component {
  constructor(props) {
    super(props);
  }

  
  submitd = (e, recipe_id, title) => {
      e.preventDefault();
      confirmAlert({
      title: 'Сигурни ли сте?',
      message: 'Потвърдете, че искате да изтриете рецептата за ' + title + '?',
      buttons: [
        {
          label: 'Да',
          onClick: () => {
            console.log(this.props.id);
            axios.get(`https://f-newrecipe.azurewebsites.net/api/reciperaw/${this.props.id}?code=eyi8NJWkHnQtf5aGIWrJGAJJ1Kxgocf9cerGcRR4DV0w36xVJLXIdg==`).then(response => {
              const recipe = response.data[0];

              fetch("https://f-newrecipe.azurewebsites.net/api/DeleteRecipe?code=dMFI1AbXm7Ytv/TBZ3p00IiQHWa8a4B9nVxZmJvCGul2Tkkz5xZ8VA==", {
                "method": "POST",
                "headers": {
                  "content-type": "application/json",
                  "accept": "application/json"
                },
                "body": JSON.stringify(
                  recipe
                )
              })
              .then(() => {
                this.props.rerenderParentCallback();
              })
              .catch(err => {
                console.log(err);
                confirmAlert({
                  title: 'Възникна грешка',
                  message: 'Изтриването на рецептата не беше успешно.',
                  buttons: [
                    {
                      label: 'Затвори'
                    }
                  ],
                  closeOnEscape: true,
                  closeOnClickOutside: true,
                });

              })

            })
            .catch(err => {
              
              console.log(err);

              confirmAlert({
                title: 'Възникна грешка',
                message: 'Изтриването на рецептата не беше успешно. ',
                buttons: [
                  {
                    label: 'Затвори'
                  }
                ],
                closeOnEscape: true,
                closeOnClickOutside: true,
              });      

              console.log(err);        
            })  
      
          }
        },
        {
          label: 'Не'
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

    render() {
  	const recipe = this.props;
  	return <>           <div className="small-12 medium-6 row matrix " > 
  
        <NavLink to={'./viewrecipe/'+recipe.id} className="column clickable small-12 labeled imageDiv inMatrix"> 
            <h6>{recipe.title}</h6>
            <img src={"https://foodplannerweb.blob.core.windows.net/images/"+recipe.imageName}  alt="" /> 
        </NavLink>  
        
        <div className="small-12 row recipesButtons ">
          <div className="row ">
            <NavLink to={'./editrecipe/'+recipe.id} id="editRecipe" className="foodMenuBtn clickable recipeButton" >редакция</NavLink>
          </div>
          <div className="row ">
            <NavLink to="" onClick={(e) => this.submitd(e, recipe.id, recipe.title)} id="deleteRecipe" className="foodMenuBtn clickable recipeButton" >изтриване..</NavLink>
          </div>
        </div>

  </div> 
       

   </>;
  }
}


class App extends React.Component {
  state = {
    userName: '',
    recipes: [],
    pageStart: 0,
    pageEnd: 0,
    prevClass: "disabledLink",
    nextClass: ""
  };

  constructor(props) {
    super(props);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  rerenderParentCallback() {
    setTimeout(() => { this.fetchData(); }, 200);
    console.log("reloaded recipes");
  }

  async fetchData() {
    try {
      const resp = await axios.get("https://f-newrecipe.azurewebsites.net/api/listfor/" + this.props.authcontext.account.idTokenClaims.emails[0] + "?code=mNzSOpiWRNb79zLn0MvpHXHUUiKPCvTFG15rHACk7raaPl1keyC8XQ==");
      this.setState({recipes: resp.data});

      if (resp.data.length == 0) { this.setState({pageStart: 0, pageEnd: 0, prevClass: "disabledLink", nextClass: "disabledLink" }); }
      else if (resp.data.length < 5) { this.setState({pageStart: 1, pageEnd: resp.data.length, prevClass: "disabledLink", nextClass: "disabledLink" }); }
      else { this.setState({pageStart: 1, pageEnd: 4, prevClass: "disabledLink", nextClass: "" }); }

    }
    catch {
      this.setState({fatalError: true});
    }
    finally {
      try { document.getElementById("loadingData").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' ); } catch {}
    }
  }

  async componentDidMount() {
    this.fetchData();
  }


	render() {

    if (this.state.fatalError) {
      return <main className="headLabel">
          <div className="row limited" >
              <h1>Моите рецепти</h1>
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

        <RecipeList rerenderParentCallback={this.rerenderParentCallback} from={this.state.pageStart - 1} to={this.state.pageEnd} recipes={this.state.recipes} />
        
        <div className="row limited pageLinkHolder">
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


const MyRecipes = props => {

  var form;
  if (props.authcontext.isAuthenticated) {
    form = <App title="Моите рецепти" authcontext={props.authcontext} />

  } else {
    form = <> 
      <div className="row limited unauth">
          <h2>Влезте в приложението за да продължите</h2>
      </div>
      <div className="row limited unauth">
          <div id="userProfileLeft" className="column small-12" onClick={() => props.authcontext.onSignIn()}>
              <div id="userName">Вход</div>
              <div id="userImageHolder"><img src={userprofile} alt="Профил" /></div>
          </div>
      </div>
    </>
  }

  return (
    <main>
       { form }
    </main>
  );
};

export default MyRecipes;