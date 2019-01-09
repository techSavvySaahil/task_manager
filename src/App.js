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
      Created: [],
      Won: [],
      Lost: [],
      loading: false
    }

    this.populateRecords = ()=> {
      this.setState({loading: true});
      base('Imported table').select({
          view: 'Grid view'
      }).firstPage((err, records)=> {
          if (err) {
            console.error(err);
            alert("Couldn't populate records. Please reload the page.")
            this.setState({loading: false});
            return;
          }
          let status = "";
          let obj = {
            Created: [],
            Won: [],
            Lost: []
          };
          if(records) {
            records.forEach((record)=> {
                status = record.fields.status;
                obj[status].push(record)
            });
            this.setState({Created: obj.Created});
            this.setState({Won: obj.Won});
            this.setState({Lost: obj.Lost});
            this.setState({loading: false});
          }
        });
    }
    
    this.updateRecord = (id, newValue, key="status")=> {
      this.setState({loading: true});
      console.log(this.populateRecords);
      base('Imported table').update(id, {
        [key]: newValue
      }).then((record)=> {
          // if (err) { console.error(err); return; }
          console.log(record.get('status'));
          this.populateRecords();
      })
      .catch(error=> {
        console.log(error);
        alert("Couldn't change the status. Please try again.")
        this.setState({loading: false});
      });
    }
  }
  componentDidMount() {
    // call AirTable API for getting tasks
    this.populateRecords();
  }
  

  // const updateStatus = ({task, newStatus}) => {
  //   let id = task.id;
  //   let lastStatus = task.status;
  //   task.status = newStatus;
  //   // first let's delete it from the previous status board
  //   delete this.state[lastStatus][id];
  //   this.setState({
  //     [lastStatus]: this.state[lastStatus]
  //   });
  //   // now let's add it to the new status board
  //   this.state[newStatus][id] = task;
  //   this.setState({
  //     [newStatus]: this.state[newStatus]
  //   });
  // }
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