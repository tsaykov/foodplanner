import RecipeBlock from './RecipeBlock';

function DayOfWeek(props) {
    const { breakfast, lunch, dinner, day, index, activePlan } = props;

    if (breakfast==undefined) { return <> </> }
    if (lunch==undefined) { return <> </> }
    if (dinner==undefined) { return <> </> }

    var dayName;
    
    switch (day) {
      case 0:
        dayName = "неделя";
        break;
      case 1:
        dayName = "понеделник";
        break;
      case 2:
        dayName = "вторник";
        break;
      case 3:
        dayName = "сряда";
        break;
      case 4:
        dayName = "четвъртък";
        break;
      case 5:
        dayName = "петък";
        break;
      case 6:
        dayName = "събота";
    }
    
    var dividedLine;
    if (activePlan == true) {
        dividedLine = <tr><td></td></tr>;
    } else {
        dividedLine = <tr><td></td><td className="shorter"><hr/></td><td className="shorter"><hr/></td><td className="shorter"><hr/></td></tr>;
    }

    return <>
      <tr>
        <td className="dayOfWeekColumn">&nbsp;{dayName}</td>
        <RecipeBlock mealNo={0} dayNo={index} recipe={breakfast} activePlan={activePlan} openRecipeDialog={props.openRecipeDialog}/>
        <RecipeBlock mealNo={1} dayNo={index} recipe={lunch} activePlan={activePlan} openRecipeDialog={props.openRecipeDialog}/>
        <RecipeBlock mealNo={2} dayNo={index} recipe={dinner} activePlan={activePlan} openRecipeDialog={props.openRecipeDialog}/>
      </tr> 

      { dividedLine }
    </>
};

export default DayOfWeek;