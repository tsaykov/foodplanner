import React from 'react';
import newRecipeIcon from '../../images/newRecipe.png';
import myRecipesIcon from '../../images/myRecipes.png';
import allRecipesIcon from '../../images/allRecipes.png';

import { NavLink } from 'react-router-dom';


const RecipesNav = props => {
  return (
    <main>

      <h1 className="onlyOnSmall">Рецепти</h1>

      <div className="row limited pad">
          <NavLink to='/NewRecipe' activeClassName="activeBlock" className="column small-12 medium-4 labeled">
              <h5>Нова рецепта</h5>
              <img src={newRecipeIcon} alt="нова рецепта" /> 
          </NavLink>

          <NavLink to='/MyRecipes' activeClassName="activeBlock" className="column small-12 medium-4 labeled">
               <h5> Моите рецепти </h5>
               <img src={myRecipesIcon} alt="cheese cake" /> 
          </NavLink>

          <NavLink to='/AllRecipes' activeClassName="activeBlock" className="column small-12 medium-4 labeled">
               <h5>Всички рецепти</h5>
               <img src={allRecipesIcon} alt="cheese cake" /> 
          </NavLink>

      </div>

  </main>
  );
};

export default RecipesNav;