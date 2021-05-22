import React from 'react';
import { Home } from './views/Home';
import { RecipesNav } from './views/RecipesNav';
import { WeekMenu } from './views/WeekMenu';
import { QuickRecipe } from './views/QuickRecipe';
import { HouseHold } from './views/HouseHold';
import { NewRecipe } from './views/NewRecipe';
import { MyRecipes } from './views/MyRecipes';
import { EditRecipe } from './views/EditRecipe';
import { AllRecipes } from './views/AllRecipes';
import { ViewRecipe } from './views/ViewRecipe';
import { Fail } from './views/Fail';
import { NavBar } from './components/NavBar';
import { Route, Switch, Redirect } from 'react-router-dom';
import Title from './Title';
import AuthProvider from './providers/auth-provider';
import { AuthContext } from './context/auth-context';

class Routes extends React.Component { 
  render() {
    const auth = this.context;

    return (
      <div>
        <Title />
        <NavBar />
        <Switch>
          <Route exact path="/Home" render={(props) => <Home authcontext={ this.context } />} />      
          <Route exact path="/web/index.html">
              <Redirect to="/Home" />
          </Route>
          <Route exact path="/">
              <Redirect to="/Home" />
          </Route>
          <Route exact path="/WeekMenu" render={(props) => <WeekMenu authcontext={ this.context } />} />      
          <Route exact path="/RecipesNav" component={RecipesNav} />      
          <Route exact path="/NewRecipe" render={(props) => <NewRecipe authcontext={ this.context } />} />   
          <Route exact path="/MyRecipes" render={(props) => <MyRecipes authcontext={ this.context } />} />   
          <Route exact path="/editrecipe/:id" render={(props) => <EditRecipe authcontext={ this.context } />} />   
          <Route exact path="/AllRecipes" component={AllRecipes} />   
          <Route exact path="/viewrecipe/:id" render={(props) => <ViewRecipe authcontext={ this.context } />}  />   
          <Route exact path="/QuickRecipe" render={(props) => <QuickRecipe authcontext={ this.context } />} />      
          <Route exact path="/HouseHold" render={(props) => <HouseHold authcontext={ this.context } />} />    
          <Route exact path="/Fail" component={Fail} />     
        </Switch>
      </div>
    )
  }
}



Routes.contextType = AuthContext;

export default AuthProvider(Routes);