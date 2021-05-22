import DayOfWeek from './DayOfWeek';

function WeekMenuPane(props) {
    const { breakfasts, lunches, dinners, ready, planColorClass, activePlan, updateEndDate } = props;
    let startDay = props.startDay;
  
    if (ready==false) { return <> </> }
    if (breakfasts==undefined) { return <> </> }
    if (lunches==undefined) { return <> </> }
    if (dinners==undefined) { return <> </> }
  
    let skipDays = 0;

    if (startDay == -1) {
        startDay = new Date().getDay()
    } else {
        var currentDay = new Date().getDay();
        if (currentDay > startDay) {
            skipDays = currentDay - startDay;
        } else {
            if (currentDay < startDay) {
                skipDays = 7 - startDay + currentDay;
            }            
        }
    }

    const items = []

    for (var i = 0; i < 7; i++) {
        if (skipDays <= i) {
            items.push(<DayOfWeek day={startDay} index={i} breakfast={breakfasts[i]} lunch={lunches[i]} dinner={dinners[i]} activePlan={activePlan} openRecipeDialog={props.openRecipeDialog} key={i} />)
        }
        startDay++;
        if (startDay==7) { startDay=0; }
    }
  
    return <table className={planColorClass}>
        <tbody>
          <tr>
            <th></th>
            <th>закуска</th>
            <th>обяд</th>
            <th>вечеря</th>    
          </tr>
    
            {items}
        </tbody>
    </table>
  }

  export default WeekMenuPane;
  