import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';

function RecipeDialog(props) {
    const { onClose, selectedValue, open, ready, dialogOpenForMeal } = props;
    let recipes = props.recipes;

    if (ready==false) { return <> </> }
  
    if (recipes==undefined) { return <> </> }
    if (recipes.breakfasts==undefined) { return <> </> }
    if (recipes.mains==undefined) { return <> </> }
    if (dialogOpenForMeal==-1) { return <> </> }
  
    var recipeList;
    if (dialogOpenForMeal == 0) { 
        recipeList = recipes.breakfasts 
    } else {
        recipeList = recipes.mains;
    }

    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };
    
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Изберете рецепта</DialogTitle>
        <List>
          <ListItem button onClick={() => handleListItemClick("empty")} key="empty" >
               <ListItemText primary="--- без назначение ---" />
          </ListItem>

          {recipeList.map((recipe) => (
            <ListItem button onClick={() => handleListItemClick(recipe.id)} key={recipe.id}>
  
              <ListItemText primary={recipe.title} />
            </ListItem>
          ))}
          
        </List>
      </Dialog>
    );
  }
  
  RecipeDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    
  };

export default RecipeDialog;