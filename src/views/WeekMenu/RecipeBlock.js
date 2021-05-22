
import { NavLink } from 'react-router-dom';

function RecipeBlock(props) {
    const { recipe, mealNo, dayNo, activePlan } = props;
  
      if (recipe==undefined) { return <> </> }
  
      const changeRecipe = (e) => {
          e.preventDefault();
          props.openRecipeDialog(mealNo, dayNo);
      }

      var editBtn;
      if (activePlan == false) {
          editBtn = <div className="foodMenuBtnHolder">
            <NavLink to='' className="foodMenuBtn column clickable labeled inTableLink imageDiv" onClick={changeRecipe}>замени..</NavLink>
          </div>
      } else {
          editBtn = <> </>
      }
      
      var recipeLink;

      if (recipe.id != "empty") {
          recipeLink = <NavLink to={'./viewrecipe/'+recipe.id} target="_blank" className="column clickable labeled inTableLink imageDiv" > 
            <h4>{recipe.title}</h4>
            <img className="NavLinkHolder" src={"https://foodplannerweb.blob.core.windows.net/images/" + recipe.imageName} alt="" /> 
            <h3>{recipe.accents}</h3>
          </NavLink>

      } else {
          recipeLink = <div className="column labeled inTableLink imageDiv" > 
            <img className="NavLinkHolder" src="https://foodplannerweb.blob.core.windows.net/images/empty.png" alt="" /> 
          </div>
      }


      return <td>
        <div className="row limited white" > 
  
          { recipeLink }
  
          { editBtn }
   
        </div>  
      </td>
  }

  export default RecipeBlock;