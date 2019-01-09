import React, { Component } from 'react';
import './styles/App.css';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Board from './components/board';
import Airtable from 'airtable';
import Config from './config/API';

const base = new Airtable({apiKey: Config.API_key}).base('appS0hWdEtDwy1hCW');

const allStatus = ["Created", "Won", "Lost"];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Created: {},
      Won: {},
      Lost: {},
      loading: false
    }

    this.populateRecords = ()=> {
      this.setState({loading: true});
      base('Imported table').select({
          view: 'Grid view'
      }).firstPage((err, records)=> {
          if (err) {
            alert("Couldn't populate records. Please reload the page.")
            this.setState({loading: false});
            return;
          }
          let status = "";
          let obj = {
            Created: {},
            Won: {},
            Lost: {}
          };
          if(records) {
            records.forEach((record)=> {
                status = record.fields.status;
                obj[status][record.id] = record;
            });
            this.setState({Created: Object.assign({}, obj.Created)});
            this.setState({Won: Object.assign({}, obj.Won)});
            this.setState({Lost: Object.assign({}, obj.Lost)});
            this.setState({loading: false});
          }
        });
    }
    
    this.updateRecord = (id, lastValue, newValue, key="status")=> {
      base('Imported table').update(id, {
        [key]: newValue
      }).then((record)=> {
      })
      .catch(error=> {
        alert("Couldn't change the status. Please try again.")
      });

      let prevBoard = Object.assign({}, this.state[lastValue]);
      let newBoard = Object.assign({}, this.state[newValue]);

      let task = prevBoard[id];
      // Updating the status
      task.fields.status = newValue;

      // Adding the task to the new board
      newBoard[id] = task;
      this.setState({
        [newValue]: newBoard
      });

      // let's delete it from the previous board
      delete prevBoard[id];
      this.setState({
        [lastValue]: prevBoard
      });
    }
  }
  componentDidMount() {
    // call AirTable API for getting tasks
    this.populateRecords();
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span className="title">Task Manager</span>
        </header>
        <div className="wrapper">
          {(this.state.loading && <div style={{width:"100%", height: "100vh", position:"fixed", backgroundColor:"#00000061"}}>
            <p style={{color:"white",marginTop:"15%"}}>Loading...</p>
          </div>)}
          {allStatus.map(status => (
            <Board key={status} name={status} tasks={this.state[status]} updateRecord={this.updateRecord} />
          ))}
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);