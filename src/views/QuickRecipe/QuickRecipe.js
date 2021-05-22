import { NavLink } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


function RecipeList(props) {
  const recipes=props.recipes;

  if (recipes==undefined) 
  {
       return <p></p>
  }

  
  return <div className="bigRecipeView"> 
    <Carousel showArrows={true} swipeable={true} showStatus={false} emulateTouch={true}  infiniteLoop={true} 
        useKeyboardArrows={true} autoPlay={true} showIndicators={true} showThumbs={false} interval={5000} >
        
        {recipes.map(recipe => <Recipe key={recipe.id} {...recipe}/>)}
    </Carousel>
  
  </div>
  
}

class Recipe extends React.Component {
	render() {
  	const recipe = this.props;
    var postTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
    postTime.setUTCSeconds(recipe._ts);

  	return ( <div className="row centered" > 
        <NavLink to={'./viewrecipe/'+recipe.id} className="column clickable small-12 medium-6 large-8 labeled imageDiv  marginLeft quickrecipe"> 
            <h6>
                {recipe.title}
            </h6>
            <img src={"https://foodplannerweb.blob.core.windows.net/images/"+recipe.imageName}  alt="" /> 
            <p>{recipe.accents}</p>
        </NavLink>  

        <section className="column small-12 medium-5 display">
            <div className="authorBlock"> 
                <span className="date">от &nbsp;</span><span className="authorName"><strong>{recipe.author}</strong></span>
                <span className="date">,&nbsp; {postTime.toLocaleString()}</span>
            </div>
            <br/>
            <h6>Категория</h6> 
            <h5>{            
                recipe.tags
                .map(item => <span key={item}>{item}</span>)
                .reduce((acc, x) => acc === null ? [x] : [acc, ', ', x], null)          
            }</h5>

            <h6>Сложност</h6> 
            <h5>{recipe.complexity}</h5>

            <h6>Време за готвене</h6> 
            <h5>{recipe.cookingTime} минути</h5>
        </section>
      </div>

    );
  }
}

class QuickRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "notLoggedIn",
      profileProvisionError: false,
      fatalError: false,
      isAuthenticated: this.props.authcontext.isAuthenticated
    };
  }
  
  async componentDidMount() {
    try {
      let userId = "notLoggedIn";
      var url = "https://f-newrecipe.azurewebsites.net/api/GetRandomRecipes?count=3&code=Sv4jy53zrJo4YKh5ODTQxscxNGDEbnQLgZgJmVwMtw2E/n3vmCKaqg==";
      if (this.props.authcontext.isAuthenticated) { 
        this.setState({userId: this.props.authcontext.account.idTokenClaims.emails[0]}); 
        userId = this.props.authcontext.account.idTokenClaims.emails[0];

        /// има логнат потребител, но проверяваме дали е попълнил профила си
        const resp_status = await axios.get(`https://f-newrecipe.azurewebsites.net/api/getstate/${userId}?code=Rcz1aJBwYNhw84F77gBpc0GycdtjSDhPH/wg9bWlmzDRc5DL7QY22Q==`);
        if (resp_status.data == undefined) {
          console.log(`грешка при извличане данни за профила`);
          this.setState({fatalError: true});
          try { document.getElementById("loadingData").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' ) } catch { }
          return;
        }      

        if (resp_status.data == "NOK") {
          this.setState({ profileProvisionError: true });
        } else {
          url = `https://f-newrecipe.azurewebsites.net/api/profile/rec-${userId}?code=FquSUbQQzph9sd6v8gRH2xavxjMqTGskK2ETLe4VNNS4NrG8TzJgsA==`;
          this.setState({ profileProvisionError: false });
        }
      }

      const resp = await axios.get(url, {data: {}}, {headers: {'Content-Type': 'text/json'}} );
      var recipesObject;
      if (typeof resp.data === 'string' || resp.data instanceof String) {
        recipesObject = JSON.parse(resp.data);
      } else {
        recipesObject = resp.data;
      }
      this.setState({recipes: recipesObject, fatalError: false});
      try { document.getElementById("loadingData").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' ) } catch { }
    }
    catch {
      this.setState({fatalError: true});
      try { document.getElementById("loadingData").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' ) } catch { }
      return;
    }      
  }

  render() {

    var form;

    if (this.state.fatalError) {
      return <main className="headLabel">
          <div className="row limited" >
              <h1>Бърза рецепта</h1>
          </div>
          <section className="column small-12"> </section>
          <div className="row limited unauth">
              <h5 className="warningMsg narrow small-12">❢ &nbsp;Възникна грешка при обработка на информацията. Моля, опитайте по-късно.</h5>
          </div>
      </main>;
  
    }
    else if (this.props.authcontext.isAuthenticated) {

      if (this.state.profileProvisionError == true) {
          form = <> 
              <div className="row limited" >
                  <h1>Бърза рецепта</h1>
              </div>
              <section className="column small-12"> </section>
              <div className="row limited unauth">
                  <h5 className="warningMsg narrow small-12">❢ &nbsp;За персонализирани предложения, моля попълнете данни за Вашето домакинство:</h5>
                  <NavLink to='/HouseHold' className="navBox column noMarginBottom narrowVertical ">
                      <h5>Домакинство</h5>
                  </NavLink>

              </div>


            <div className="row limited" >
              <section className="column small-12">
                  <h1 id="loadingData" className="loader">{this.props.title}</h1>
              </section>

              <h1 id="homeScreenH1">Някои от нашите предложения</h1>
              <RecipeList recipes={this.state.recipes} />
              
            </div>
          </>

      } else {
        form = <> 
        <div className="row limited" >
          <h1>Персонализирани предложения за Вас</h1>
          <section className="column small-12">
              <h1 id="loadingData" className="loader">{this.props.title}</h1>
          </section>

          <RecipeList recipes={this.state.recipes} />
          
        </div>
        </>
      }
    } else {
      form = <> 
        <div className="row limited ">
            <p>Влезте в приложението за персонализирани предложения</p>
        </div>
        <div className="row limited"> <p>&nbsp;</p> </div>

        <div className="row limited" >
          <h1>Някои от нашите предложения</h1>
          <section className="column small-12">
              <h1 id="loadingData" className="loader">{this.props.title}</h1>
          </section>

          <RecipeList recipes={this.state.recipes} />
          
        </div>
      </>

    }

    return (
      <main className="headLabel">
          { form }
      </main>
    );

  }
}

export default QuickRecipe;