import React from 'react';
import css from './App.css';

class App extends React.Component {

  state = {
    timeSlotsArr: [],
    eventsDetails: [
      {
        startTime: 1598847300000,
        endTime: 1598852700000,
      },
      {
        startTime: 1598877600000,
        endTime: 1598880600000
      },
      {
        startTime: 1598878800000,
        endTime: 1598882400000
      },
      {
        startTime: 1598880900000,
        endTime: 1598884500000
      }
  ],
  }

  initialiseTimeSlotArr() {
    const timeSlotsArr = [];
    for (let i = 9; i <= 21; i++) {
      timeSlotsArr.push(i)
    }
    this.setState({ timeSlotsArr });
  }

  eventsBoxesStyle(eventStartTime, eventEndTime, effColliders, currEventIndex) {
    const startTime = new Date(eventStartTime);
    const endTime = new Date(eventEndTime);

    const startTimeHours = startTime.getHours();
    const startTimeMinutesinHours = Number((startTime.getMinutes() / 60).toFixed(2));
    const startTimeInHours = startTimeHours + startTimeMinutesinHours;

    const endTimeHours = endTime.getHours();
    const endTimeMinutesinHours = Number((endTime.getMinutes() / 60).toFixed(2));
    const endTimeInHours = endTimeHours + endTimeMinutesinHours;

    const topSpace = ((startTimeInHours - 9) * 60);
    const height = (endTimeInHours - startTimeInHours) * 60;

    let widthUtilisedByPreviousOnes = 0;

    if (document.getElementById('relativePosition') !== null) {
      console.log(document.getElementById('relativePosition').childNodes[0])
      for (let i = 0; i < currEventIndex; i++) {
        widthUtilisedByPreviousOnes += Number(document.getElementById('relativePosition').childNodes[i].style.width.replace('%', ''));
      }
    }

    

    return {
      position: 'absolute',
      border: '1px solid red',
      top: `${topSpace}px`,
      height: `${height}px`,
      width: effColliders ? `${( 1 / ( 1+ effColliders) * 100)}%` : `100%`,
      left: (widthUtilisedByPreviousOnes % 100 === 0) ? '0%' : `${widthUtilisedByPreviousOnes % 100}%`
    }

  }

  render () {
    console.log('render')
    return (
      <div className="timeEventWrapper">
        <div>
          {
            this.state.timeSlotsArr.map
            (
              (timeSlot, index) => <div key={index} className='timeSlots'><hr style={{margin: '0px'}}/>{timeSlot}:00</div>
            )
          }
        </div>
        <div>
          <div id="relativePosition">
            {this.state.eventsDetails.map( (event, index) => 
              <div style={this.eventsBoxesStyle(event.startTime, event.endTime, event.effectiveColliders, index)} key={index}/>
            )}
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.initialiseTimeSlotArr();
  }

  updateEventCollidingDetails(eventDet, currIdx) {
    const collidingIndexes = [];
    for (let i = 0; i < currIdx; i++) {
      if (eventDet[currIdx].startTime < eventDet[i].endTime) {
        collidingIndexes.push(i)
      }
    }
    for (let i = 0; i < collidingIndexes.length; i++) {
      eventDet[collidingIndexes[i]].collidingIndexes.push(currIdx);
      eventDet[currIdx].collidingIndexes.push(collidingIndexes[i])
    }
    eventDet[currIdx].effectiveColliders = collidingIndexes.length;
    // pending the case when the current one is colliding with less than some of previous one
    // maintain an object of visited ones to iterate on all the values of colliding indexes to any nested level
    for (let i = 0; i < collidingIndexes.length; i++) {
      if (eventDet[currIdx].effectiveColliders > eventDet[collidingIndexes[i]].effectiveColliders) {
        eventDet[collidingIndexes[i]].effectiveColliders = eventDet[currIdx].effectiveColliders;
      }
    }

  }

  componentWillMount() {
    const eventDetailsCopy = [...this.state.eventsDetails];

    for (let i = 0; i < eventDetailsCopy.length; i++) {
      eventDetailsCopy[i].collidingIndexes = [];
      eventDetailsCopy[i].effectiveColliders = 0;
    }

    for (let i = 1; i < eventDetailsCopy.length; i++) {
      this.updateEventCollidingDetails(eventDetailsCopy, i)
    }
    console.log(eventDetailsCopy)
    this.setState({
      eventsDetails: eventDetailsCopy,
    })
  }


}

export default App;
