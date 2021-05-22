import axios from 'axios';
import React from 'react';
import userprofile from '../../images/userProfile.png';
import WeekMenuPane from './WeekMenuPane';
import { NavLink } from 'react-router-dom';
import RecipeDialog from './RecipeDialog';
import { confirmAlert } from 'react-confirm-alert';
import "../../react-confirm-alert.css";
import withWindowDimensions from './withWindowDimensions.jsx';


class WeekMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "notLoggedIn",
      isAuthenticated: this.props.authcontext.isAuthenticated,
      wasAuthenticated: "none",
      loaderClass: "",
      open: false,
      dialogOpenForDay: -1,
      dialogOpenForMeal: -1,
      recipes: [],
      dinners: [],
      lunches: [],
      breakfasts: [],
      ready: false,
      activePlan: false,
      startDay: -1,
      planEndDay: "",
      profileProvisionError: false,
      fatalError: false
    };
    
    this.openRecipeDialog = this.openRecipeDialog.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.newPlan = this.newPlan.bind(this);
    this.cancelPlan = this.cancelPlan.bind(this);
    this.load = this.load.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    
  }
  

  async componentDidMount() {
      this.load();
  }

  async load() { 
    try {
      let userId = "notLoggedIn"; 

      if (this.props.authcontext.isAuthenticated) { 
        
          this.setState({ loaderClass:"loader" });
          try { document.getElementById("recipePane").className += " hidden"; } catch {}    
          try { document.getElementById("navSection").className += " hidden"; } catch {}    
          try { document.getElementById("navSection2").className += " hidden"; } catch {}
          
          this.setState({userId: this.props.authcontext.account.idTokenClaims.emails[0]}); 
          userId = this.props.authcontext.account.idTokenClaims.emails[0];
          this.setState({wasAuthenticated: "yes"});

          /// има логнат потребител, но проверяваме дали е попълнил профила си
          const resp_status = await axios.get(`https://f-newrecipe.azurewebsites.net/api/getstate/${userId}?code=Rcz1aJBwYNhw84F77gBpc0GycdtjSDhPH/wg9bWlmzDRc5DL7QY22Q==`);
          if (resp_status.data == undefined) {
            console.log(`грешка при извличане на данни за профила`);
            this.setState({fatalError: true, loaderClass: ""});
            return;
          }      

          if (resp_status.data == "NOK") {
            this.setState({ profileProvisionError: true, ready: true });
            return;
          } else {
          
            /// извличаме информация за съществуващ план за хранене (ако има такъв)
            const resp_status = await axios.get(`https://f-newrecipe.azurewebsites.net/api/plans/${userId}?code=5tTRRbCCj229DZPAmNeAjWjx4fLX404tBpybRYaI2AAbsdSU9XIn/A==`);
            if (resp_status.data == undefined) {
              console.log(`грешка при извличане на план за хранене`);
              this.setState({fatalError: true, loaderClass: ""});
              return;
            }

            let getRecipesURL;

            if (resp_status.data == "no") {
              this.setState({activePlan: false, profileProvisionError: false, planColorClass: "tableRecipeView inactivePlan"});
              getRecipesURL = `https://f-newrecipe.azurewebsites.net/api/profile/new-${userId}?code=FquSUbQQzph9sd6v8gRH2xavxjMqTGskK2ETLe4VNNS4NrG8TzJgsA==`;

            } else {
              this.setState({activePlan: true, planColorClass: "tableRecipeView activePlan"});
              getRecipesURL = `https://f-newrecipe.azurewebsites.net/api/profile/get-${userId}?code=FquSUbQQzph9sd6v8gRH2xavxjMqTGskK2ETLe4VNNS4NrG8TzJgsA==`;

            }

            const resp = await axios.get(getRecipesURL, {data: {}}, {headers: {'Content-Type': 'text/json'}} );

            if (resp != undefined && resp.data !== undefined) {
                let breakfasts = [];
                let lunches = [];
                let dinners = [];

                try
                {
                  var recipes = JSON.parse(resp.data);
                  this.setState({recipes: recipes});
                }
                catch
                {
                  console.log("грешка при обработка на рецепти");
                  this.setState({fatalError: true, loaderClass: ""});
                }

                try
                {

                  if (this.state.activePlan) {
                    for (var i = 0; i < recipes.days; i++) {
                      breakfasts.push(recipes.breakfasts[i]);
                      lunches.push(recipes.lunches[i]);
                      dinners.push(recipes.dinners[i]);
                    }

                    let currentDay = new Date().getDay();
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
        
                    this.setState({startDay: recipes.startDay});
                    
                  } else {
                    for (var i = 0; i < 7; i++) {
                      breakfasts.push(recipes.breakfasts[Math.floor(Math.random() * recipes.breakfasts.length)]);
                      lunches.push(recipes.mains[Math.floor(Math.random() * recipes.mains.length)]);
                      dinners.push(recipes.mains[Math.floor(Math.random() * recipes.mains.length)]);
                    }
                    this.setState({startDay: -1});
        
                  }

                  this.setState({ready: true, 
                      breakfasts: breakfasts,
                      lunches: lunches,
                      dinners: dinners
                  });

                }
                catch
                {
                    console.log("грешка при подготовка на рецепти");
                    this.setState({fatalError: true, loaderClass: ""});
                }

                this.setState({ loaderClass: "", fatalError: false, profileProvisionError: false });
            //    try { document.getElementById("3ta").className = document.getElementById("loadingData").className.replace( /(?:^|\s)loader(?!\S)/g , '' ) } catch {}
                try { document.getElementById("navSection").className = document.getElementById("navSection").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
                try { document.getElementById("navSection2").className = document.getElementById("navSection2").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}
                try { document.getElementById("recipePane").className = document.getElementById("recipePane").className.replace( /(?:^|\s)hidden(?!\S)/g , '' ) } catch {}

            } else {
              // възникна грешка
              this.setState({fatalError: true, loaderClass: ""});
            }
        
        }

      } else {
        console.log(`no logged on user`);
        this.setState({wasAuthenticated: "wasNoUser"});

      }

    }
    catch {
      this.setState({fatalError: true, loaderClass: ""});
      return;
    }  
  }

  updateEndDate(text) {
    console.log("end");
    this.setState({ planEndDay: text });
  }


  openRecipeDialog(mealNo, dayNo) {
    this.setState({ 
        open: true, 
        dialogOpenForMeal: mealNo, 
        dialogOpenForDay: dayNo

    });
  }

  handleClose(value) {
    switch (this.state.dialogOpenForMeal) {
      case 0: // закуска
        if (value == "empty") {
            let temp = this.state.breakfasts;
            var emptyRecipe = { id: "empty"};
            temp[this.state.dialogOpenForDay] = emptyRecipe;
            this.setState({ breakfasts: temp });
            console.log(this.state.breakfasts);
            break;
        }

        for(var i = 0; i < this.state.recipes.breakfasts.length; i++) {
          if(this.state.recipes.breakfasts[i].id == value) {
              console.log(this.state.recipes.breakfasts[i]);
              let temp = this.state.breakfasts;
              temp[this.state.dialogOpenForDay] = this.state.recipes.breakfasts[i];
              this.setState({ breakfasts: temp });
              break;
          }
        }
        break;

      case 1:
        if (value == "empty") {
          let temp = this.state.lunches;
          var emptyRecipe = { id: "empty"};
          temp[this.state.dialogOpenForDay] = emptyRecipe;
          this.setState({ lunches: temp });
          break;
        }

        for(var i = 0; i < this.state.recipes.mains.length; i++) {
          if(this.state.recipes.mains[i].id == value) {
            let temp = this.state.lunches;
            temp[this.state.dialogOpenForDay] = this.state.recipes.mains[i];
            break;
          }
        }
        break;

      case 2:
        if (value == "empty") {
          let temp = this.state.dinners;
          var emptyRecipe = { id: "empty"};
          temp[this.state.dialogOpenForDay] = emptyRecipe;
          this.setState({ dinners: temp });
          break;
        }

        for(var i = 0; i < this.state.recipes.mains.length; i++) {
          if(this.state.recipes.mains[i].id == value) {
            let temp = this.state.dinners;
            temp[this.state.dialogOpenForDay] = this.state.recipes.mains[i];
            this.setState({ dinners: temp });
            break;
          }
        }
        break;
    }

    this.setState({ open: false });
  }

  cancelPlan(e) {
    e.preventDefault();

    confirmAlert({
      title: 'Сигурни ли сте?',
      message: 'Потвърдете, че искате да изтриете текущия план.',
      buttons: [
        {
          label: 'Да',
          onClick: () => {

            var toPost = {
              id: this.state.userId
            };
        
            toPost = JSON.stringify(toPost);
        
            fetch("https://f-newrecipe.azurewebsites.net/api/CancelPlan?code=e3TTD3sHXBkdSFJ8XCLwkx921inp2iMUTk59a7VWvLe5HPOpu1WxRA==", {
              "method": "POST",
              "headers": {
                "content-type": "application/json",
                "accept": "application/json"
              },
              "body": toPost
            })
            .then(response => response.json())
            .then(response => {
              this.setState({ activePlan: false });
        
              this.setState({ loaderClass:"loader" });
              try { document.getElementById("recipePane").className += " hidden"; } catch {}    
              try { document.getElementById("navSection").className += " hidden"; } catch {}    
              try { document.getElementById("navSection2").className += " hidden"; } catch {}
            
              this.setState({ ready: false });
              
            })    
            .catch(err => {
              console.log(err);

              confirmAlert({
                title: 'Възникна грешка',
                message: 'Изтриването на плана не беше успешно: ' + err,
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
              this.load();
        
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

  }

  newPlan(e) {
    e.preventDefault();

    var toPost = {
      id: this.state.userId,
      breakfasts: [],
      lunches: [],
      dinners: [],
      days: this.state.lunches.length,
      startDay: new Date().getDay()
    };

    for (var i = 0; i < this.state.lunches.length; i++) {
      toPost.breakfasts.push(this.state.breakfasts[i].id);
      toPost.lunches.push(this.state.lunches[i].id);
      toPost.dinners.push(this.state.dinners[i].id);
    }
        
    toPost = JSON.stringify(toPost);

    fetch("https://f-newrecipe.azurewebsites.net/api/UpdatePlan?code=jpwr8PyUqSrEMcoMnsjVckOakxYx5osLOABm6WxfQkT5u58GlhssMQ==", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": toPost
    })
    .then(response => response.json())
    .then(response => {
      this.setState({ errorMsg: "" });
      this.setState({ activePlan: true });

      this.setState({ loaderClass:"loader" });
      try { document.getElementById("recipePane").className += " hidden"; } catch {}    
      try { document.getElementById("navSection").className += " hidden"; } catch {}    
      try { document.getElementById("navSection2").className += " hidden"; } catch {}
     
      this.setState({ ready: false });

    })    
    .catch(err => {
      console.log(err);

      confirmAlert({
        title: 'Възникна грешка',
        message: 'Записването на плана не беше успешно: ' + err,
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
      this.load();

    })       
    
  }
  
  render() {

    if (this.props.windowWidth != undefined && this.props.windowWidth > 0 && this.props.windowWidth < 769) {
      console.log("Широчината на екрана е твърде малка: " + this.props.windowWidth);
      return <main className="headLabel">
        <div className="row limited" >
            <h1>Седмично меню</h1>
        </div>
        <section className="column small-12"> </section>
        <div className="row limited unauth">
            <h5 className="narrow small-12">❢ &nbsp;За тази функция е необходимо устройство с по-широк екран.</h5>
        </div>
      </main>;
    } 

    if (this.props.authcontext.isAuthenticated && this.state.wasAuthenticated == "wasNoUser" )
    {
      this.props.authcontext.onSignOut();
      return <></>;
    }
      
    if (this.state.fatalError) {
        return <main className="headLabel">
            <div className="row limited" >
                <h1>Седмично меню</h1>
            </div>
            <section className="column small-12"> </section>
            <div className="row limited unauth">
                <h5 className="warningMsg narrow small-12">❢ &nbsp;Възникна грешка при обработка на информацията. Моля, опитайте по-късно.</h5>
            </div>
        </main>;
    
    }
    
    var form;

    if (this.props.authcontext.isAuthenticated) {

      var recipeControls;

      if (this.state.ready == false) { 
        recipeControls = <>
          <section className="row small-12 hidden" id="navSection"> </section>          
          <section className="row small-12 hidden" id="navSection2"> </section>
        </>
      }

      else if (this.state.profileProvisionError) {
          return <main className="headLabel">
              <div className="row limited" >
                  <h1>Седмично меню</h1>
              </div>
              <section className="column small-12"> </section>
              <div className="row limited unauth">
                  <h5 className="warningMsg narrow small-12">❢ &nbsp;За да използвате тази функция, моля попълнете данни за Вашето домакинство:</h5>
                  <NavLink to='/HouseHold' className="navBox column noMarginBottom narrowVertical ">
                      <h5>Домакинство</h5>
                  </NavLink>

              </div>
          </main>;
      
      }
      else if (this.state.activePlan) {
        recipeControls = <>
          <section className="row small-12 hidden" id="navSection">
            <p>Вие имате активен план за хранене {this.state.planEndDay} </p>
          </section>
    
          <section className="row small-12 hidden" id="navSection2">
            <NavLink to='/MyRecipes' id="navCancelPlan" onClick={ this.cancelPlan } className="navBox column ">
                <h5>Откажи този план</h5>
            </NavLink>
          </section>

        </>

      } else {
        recipeControls = <>
          <section className="row small-12 hidden" id="navSection">
            <p>В момента нямате активен план.</p> 
          </section>
    
          <section className="row small-12 hidden" id="navSection2">
            <NavLink to='/MyRecipes' id="navNewPlan" onClick={ this.newPlan } className="navBox column ">
                <h5>Стартирай този план</h5>
            </NavLink>
          </section>

          <RecipeDialog recipes={this.state.recipes}  
              open={this.state.open}
              dialogOpenForMeal={this.state.dialogOpenForMeal}
              onClose={this.handleClose} 
              ready={this.state.ready} 
          />

        </>

      }

      form = <> 
        <div className="row limited" >

          <h1>Седмично меню</h1>

          <section className="column small-12">
              <h1 id="loadingData" className={this.state.loaderClass}>{this.props.title}</h1>
          </section>

          { recipeControls }

          <section id="recipePane" className="small-12 noMarginLeft">
              <WeekMenuPane 
                  breakfasts={this.state.breakfasts} 
                  lunches={this.state.lunches} 
                  dinners={this.state.dinners} 
                  openRecipeDialog={this.openRecipeDialog} 
                  ready={this.state.ready}
                  activePlan={this.state.activePlan}
                  startDay={this.state.startDay}
                  planColorClass={this.state.planColorClass}
                  updateEndDate={this.updateEndDate}
              />
          </section>
        </div>
        </>
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

    return (
      <main className="headLabel">
          { form }
      </main>
    );

  }
}

export default withWindowDimensions(WeekMenu);