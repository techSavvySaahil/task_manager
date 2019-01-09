import React from 'react';
import {DropTarget} from 'react-dnd';
import Task from './task';

const dropTarg = {
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drops
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();
    console.log(component);
    // TODO: function for changing status - call the callback with the reqd params(ie. id, status)
    props.updateRecord(item.id, props.name);
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
				{this.props.tasks.map(task=>
					<Task key={task.id} task={task} />
				)}
			</div>
		)
	}
}

export default DropTarget(["task"], dropTarg, collect)(Board);