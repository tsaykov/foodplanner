import React, { useState }  from 'react';
import { NavLink } from 'react-router-dom';


import '../../normalize.css';
import '../../small.css';
import '../../medium.css';
import '../../large.css';


const NavBar = () => {
  const [open, setOpen] = useState(false);
return (
    <div>

      <nav>
        <div className="row limited">
        <button id="hamburgerBtn" onClick={() => setOpen(!open)}>&#9776;</button>
        <ul  className={open ? "open" : null} id="primaryNav">
            <li> <NavLink to='/Home' activeClassName="active" onClick={() => setOpen(false)}> Начало </NavLink> </li>
            <li> <NavLink to='/RecipesNav' activeClassName="active" onClick={() => setOpen(false)}> Рецепти </NavLink> </li>
            <li> <NavLink to='/WeekMenu' activeClassName="active" onClick={() => setOpen(false)} > Седмично меню </NavLink> </li>
            <li> <NavLink to='/QuickRecipe' activeClassName="active" exact={true} onClick={() => setOpen(false)}> Бърза рецепта </NavLink> </li>
            <li> <NavLink to='/HouseHold' activeClassName="active" exact={true} onClick={() => setOpen(false)}> Домакинство </NavLink> </li>

        </ul>

        </div> 
    </nav>
    </div> );
};


export default NavBar;


