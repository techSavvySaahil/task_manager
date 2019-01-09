import React from 'react';
import {DropTarget} from 'react-dnd';
import Task from './task';

const dropTarg = {
  drop(props, monitor, component) {
    // Obtain the dragged item
    const item = monitor.getItem();
    // call the callback with the reqd params(ie. id, status)
    props.updateRecord(item.id, item.status, props.name);
  }
};

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class Board extends React.Component {
	render() {
		const { connectDropTarget } = this.props;
		return connectDropTarget(
			<div className="board">
				<div className="board-title">{this.props.name}</div>
				{Object.values(this.props.tasks).map(task=>
					<Task key={task.id} task={task} />
				)}
			</div>
		)
	}
}

export default DropTarget(["task"], dropTarg, collect)(Board);