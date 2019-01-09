import React from 'react';
import {DragSource} from 'react-dnd';

const compSource = {
  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    console.log(props);
    console.log(props.task.id);
    const item = { comp: "task", id: props.task.id, status: props.task.fields.status };
    return item;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource()
  };
}

class Task extends React.Component {
	render() {
		const { connectDragSource } = this.props;
		return connectDragSource(
			<div className="task">
				<div className="text-left">Customer: {this.props.task.fields.customer_name}</div>
				<div className="text-left">Contact: {this.props.task.fields.customer_contact_no}</div>
				<div className="text-right">Agent: {this.props.task.fields.agent_name}</div>
			</div>
		)
	}
}

export default DragSource("task", compSource, collect)(Task);