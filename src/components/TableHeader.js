// This component creates the row containing each cell with column names


import React, {Component} from 'react';
import HeaderCell from './HeaderCells.js';

class TableHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleEvent = this.handleEvent.bind(this);
  }

  handleEvent(event) {
    const queryString = `SELECT * FROM ${this.props.tableName} ORDER BY ${event.target.placeholder} LIMIT ${this.props.currentLimit}`;
    console.log(queryString);

    this.props.reRender(queryString);
  }

  render() {
    const rowsArr = [];
    this.props.keys.forEach((val, index) => {
      rowsArr.push(
        <HeaderCell
          handleEvent={this.handleEvent}
          key={index + '_headerCell'}
          data={val}
        />
      );
    });

    return <div>{rowsArr}</div>;
  }
}

export default TableHeader;
