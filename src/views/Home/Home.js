import { NavLink } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import userprofile from '../../images/userProfile.png';

 
function RecipeList(props) {
   const recipes=props.recipes;
 
   if (recipes==undefined) 
   {
        return <p></p>
   }
    
   return <div className="bigRecipeView"> 
     <Carousel showArrows={true} swipeable={true} showStatus={false} emulateTouch={true}  infiniteLoop={true} 
         useKeyboardArrows={true} autoPlay={true} showIndicators={true} showThumbs={false} interval={5000} >
         
         {recipes.map(recipe => <Recipe key={recipe.id} {...recipe} displayClass="centered" />)}
     </Carousel>
   
   </div>   
}


class Recipe extends React.Component {
  render() {
    const recipe = this.props;
    const recipeStyle = this.props.recipeStyle;
    const sumStyle = this.props.sumStyle;
    const displayClass = this.props.displayClass;

    if (recipe == undefined) { return null; }
    if (recipe.tags == undefined) { return null; }
    var postTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
    postTime.setUTCSeconds(recipe._ts);

    return ( <div className={"row " + displayClass} > 
        <NavLink to={'./viewrecipe/'+recipe.id} className={'column clickable small-12 medium-6 large-8 labeled imageDiv ' + recipeStyle }> 
            <h6>
                {recipe.title}
            </h6>
            <img src={"https://foodplannerweb.blob.core.windows.net/images/"+recipe.imageName}  alt="" /> 
            <p>{recipe.accents}</p>
        </NavLink>  

        <section className={'column small-12 medium-5 display '+ sumStyle }>
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
 
 
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "notLoggedIn",
      isAuthenticated: this.props.authcontext.isAuthenticated,
      activePlan: false,
      loaderClass: "loader",
      readyClass: "hidden",
      ready: false,
      fatalError: false,
      wasAuthenticated: "none",
      activeMenuPeriodEndLabel: "",
      nextRecipeWhenLabel: "",
      profileProvisionError: false
    };
  }
  
  async componentDidMount() {
    try {
      let userId = "notLoggedIn";
      var url = "https://f-newrecipe.azurewebsites.net/api/GetRandomRecipes?count=3&code=Sv4jy53zrJo4YKh5ODTQxscxNGDEbnQLgZgJmVwMtw2E/n3vmCKaqg==";
      if (this.props.authcontext.isAuthenticated) { 

        this.setState({userId: this.props.authcontext.account.idTokenClaims.emails[0]}); 
        userId = this.props.authcontext.account.idTokenClaims.emails[0];
        this.setState({wasAuthenticated: "yes"});
  
        /// има логнат потребител, но проверяваме дали е попълнил профила си
        const resp_status = await axios.get(`https://f-newrecipe.azurewebsites.net/api/getstate/${userId}?code=Rcz1aJBwYNhw84F77gBpc0GycdtjSDhPH/wg9bWlmzDRc5DL7QY22Q==`);
        if (resp_status.data == undefined) {
          console.log(`грешка при извличане данни за профила`);
          this.setState({fatalError: true});
          return;
        }      

        if (resp_status.data == "NOK") {
          this.setState({ profileProvisionError: true, ready: true });
        } else {
  
          /// извличаме информация за съществуващ план за хранене (ако има такъв)
          const resp_status = await axios.get(`https://f-newrecipe.azurewebsites.net/api/plans/${userId}?code=5tTRRbCCj229DZPAmNeAjWjx4fLX404tBpybRYaI2AAbsdSU9XIn/A==`);
          if (resp_status.data == undefined) {
            console.log(`грешка при извличане данни за съществуващ план за хранене`);
            this.setState({fatalError: true});
            return;
          }
  
          let getRecipesURL;
  
          if (resp_status.data == "no") {
            this.setState({ activePlan: false, profileProvisionError: false, ready: true });
  
          } else {
            this.setState({ activePlan: true });
            getRecipesURL = `https://f-newrecipe.azurewebsites.net/api/profile/get-${userId}?code=FquSUbQQzph9sd6v8gRH2xavxjMqTGskK2ETLe4VNNS4NrG8TzJgsA==`;
      
            try
            {
                const resp = await axios.get(getRecipesURL, {data: {}}, {headers: {'Content-Type': 'text/json'}} );
                var recipes = JSON.parse(resp.data);
  
                let currentTimestamp = new Date();
                let currentHour = currentTimestamp.getHours();
                let currentDay = currentTimestamp.getDay();
  
                let dayToName = currentDay;
                let dayLabel;
  
                if (currentHour>21) { dayToName++; }
                switch (dayToName) {
                  case 0: dayLabel = "неделя"; break;
                  case 1: dayLabel = "понеделник"; break;
                  case 2: dayLabel = "вторник"; break;
                  case 3: dayLabel = "сряда"; break;
                  case 4: dayLabel = "четвъртък"; break;
                  case 5: dayLabel = "петък"; break;
                  case 6: dayLabel = "събота"; break;
                  case 7: dayLabel = "неделя"; break;
                }
  
                let remainingDays = 7;
  
                if (currentDay > recipes.startDay) {
                    remainingDays = 7 - currentDay + recipes.startDay;
                } else {
                    if (currentDay < recipes.startDay) {
                      remainingDays = recipes.startDay - currentDay; 
                    }            
                }
      
                switch (remainingDays) {
                    case 0:
                        this.setState({ planEndDay: "до днес" });
                        break;
                    case 1:
                        this.setState({ planEndDay: "до утре" });
                        break;
                    default:
                        this.setState({ planEndDay: "за следващите " + remainingDays + " дни" });
                }
        
                let currentIndex = 7 - remainingDays;
                let mealLabel;
                let recipe;
  
                switch (true) {
                  case (currentHour < 11):
                      mealLabel = "закуска";
                      recipe = recipes.breakfasts[currentIndex];
                      break;
                  case (currentHour < 15):
                      mealLabel = "обяд";
                      recipe = recipes.lunches[currentIndex];
                    break;
                  case (currentHour > 22):
                      mealLabel = "закуска";
                      recipe = recipes.breakfasts[currentIndex];
                    break;
                  default:
                      mealLabel = "вечеря";
                      recipe = recipes.dinners[currentIndex];
                }
  
                this.setState({ recipe: recipe, nextRecipeWhenLabel: mealLabel + " в " + dayLabel, profileProvisionError: false, ready: true });
            }
            catch
            {
                console.log("Грешка при обработка на рецептите.");
                this.setState({fatalError: true});
                return;
            }        
          }                   
        }
  
      } else {
        this.setState({wasAuthenticated: "wasNoUser"});
      }
  
      //console.log(`потребител ${userId}`);
      const resp = await axios.get(url, {data: {}}, {headers: {'Content-Type': 'text/json'}} );
      var recipesObject;
      if (typeof resp.data === 'string' || resp.data instanceof String) {
        recipesObject = JSON.parse(resp.data);
      } else {
        recipesObject = resp.data;
      }
      this.setState({recipes: recipesObject});
      
    }
    catch {
      this.setState({fatalError: true});

    }
    finally {
      this.setState({ loaderClass: "", readyClass: "visible" });
    }

  }

  render() {

      if (this.state.fatalError) {
        return <main className="headLabel">
            <div className="row limited" >
                <h1>Кулинарен помощник</h1>
            </div>
            <section className="column small-12"> </section>
            <div className="row limited unauth">
                <h5 className="warningMsg narrow small-12">❢ &nbsp;Възникна грешка при обработка на информацията. Моля, опитайте по-късно.</h5>
            </div>
        </main>;
      }

      var form;
      var planstatus;

      if (this.props.authcontext.isAuthenticated && this.state.wasAuthenticated == "wasNoUser" )
      {
        console.log("Грешка при управление на автентикацията.");
        this.props.authcontext.onSignOut();
        return <></>;
      }
      
      if (this.props.authcontext.isAuthenticated) {

        if (this.state.ready == true) {

          if (this.state.profileProvisionError == true) {
            planstatus = <> 
                  <div className="row limited unauth">
                      <h5 className="warningMsg narrow small-12">❢ &nbsp;За да използвате пълноценно приложението, моля попълнете данни за Вашето домакинство:</h5>
                      <NavLink to='/HouseHold' className="navBox column noMarginBottom narrowVertical ">
                          <h5>Домакинство</h5>
                      </NavLink>

                  </div>


                <div className="row limited" >
                  <section className="column small-12">
                      <h1 id="loadingData" className={this.state.loaderClass}>{this.props.title}</h1>
                  </section>

                  <h1 id="homeScreenH1" className={this.state.readyClass}>Някои от нашите предложения</h1>
                  <RecipeList recipes={this.state.recipes} />
                  
                </div>
             </>

          } 
          else if (this.state.activePlan == true) {
            planstatus =  <>
            <div className="homeHeader limited" >
              <h2>✓ Имате активен седмичен план { this.state.planEndDay }</h2>
            </div>
            <div className="row limited" >
              <h1 className="paddown">Вашата рецепта за </h1> &nbsp; &nbsp; <h1 className="paddown2"> { this.state.nextRecipeWhenLabel }</h1>
            </div>
            <div className="row limited" >
              <div className="bigRecipeView"> 
                  <Recipe key={this.state.recipe.id} {...this.state.recipe} recipeStyle="homeLink" sumStyle="sumSection" displayClass="" />
              </div>
            </div>

          </>;
              
          } else {
            planstatus = <>
                <div className="row limited unauth">
                  <h4>Нямате активен седмичен план. Натиснете тук, за да започнете</h4>
                </div>
                <div className="row limited unauth">        
                  <NavLink to='/WeekMenu' id="navPlan" onClick={ this.newPlan } className="navBox column ">
                    <h5>Планиране на меню</h5>
                  </NavLink>
                </div> 
                <div className="row limited" >
                  <h1 id="homeScreenH1" className={this.state.readyClass}>Някои от нашите предложения</h1>
                  <RecipeList recipes={this.state.recipes} />
                </div>
              </>;
          }
      
        }

        form = <> 
            { planstatus }
            <section className="column small-12  ">
              <h1 id="loadingData" className={this.state.loaderClass}>{this.props.title}</h1>
            </section>
        </>
      } else {
        form = <> 
            <div className="row limited unauth">
            <h2>Влезте в приложението за да продължите</h2>
                <div id="userProfileLeft" className="column small-12" onClick={() => this.props.authcontext.onSignIn()}>
                      <div id="userName">Вход</div>
                      <div id="userImageHolder"><img src={userprofile} alt="Профил" /></div>
                  </div>
            </div>


          <div className="row limited" >
            <section className="column small-12">
                <h1 id="loadingData" className={this.state.loaderClass}>{this.props.title}</h1>
            </section>

            <h1 id="homeScreenH1">Някои от нашите предложения</h1>
            <RecipeList recipes={this.state.recipes} />
            
          </div>
    
        </>

      }

      return (
        <main className="headLabel" >
          <div className="homeHeader limited" >
            <h1>Добре дошли в Кулинарен помощник</h1>
            <h2>Инструмент за планиране на кулинарно меню</h2>
          </div>

            { form }
        </main>
      );

}
}

export default Home;