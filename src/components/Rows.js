import React, { Component } from 'react';
import InputCell from './InputCells.js';

class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onEnter = this.onEnter.bind(this);
  }

  onEnter(event) {

  //to change the ability to edit multiple entries, conditional logic would have to be implemented here

    const PK = Object.keys(this.props.data)[0]
    const reRender = this.props.reRender;
    const uri = this.props.uri;
    const tableName = this.props.tableName
    
    if (event.key === '?') {
      const columnName = event.target.name;
      const query = event.target.placeholder;
      const filterString = `SELECT * FROM ${tableName} WHERE ${columnName} = '${query}'`

      reRender(filterString)
      
      
    }

    if (event.key === '/') {
      const columnName = event.target.name;
      const query = event.target.placeholder;
      const filterString = `SELECT * FROM ${tableName} WHERE ${columnName} != '${query}'`

      reRender(filterString)
      
    }

    if (event.key === 'Enter') {
     
      const newValue = event.target.value;
      const PKValue = this.props.data[PK];
      const columnName = event.target.name;
      let queryString;
      
      if (isNaN(newValue)) {
        queryString = `UPDATE ${tableName} SET ${columnName} = '${newValue}' WHERE ${PK} = ${PKValue}`;
      } else {
        queryString = `UPDATE ${tableName} SET ${columnName} = ${Number(newValue)} WHERE ${PK} = ${PKValue}`;
        }


      fetch('/server/update', {
        method: 'POST',
        body: JSON.stringify({ uri, queryString }),
        headers: {
          'Content-Type': 'application/json'
        }
          }).then(data => reRender())
    }
  }

  render() {
    const columns = Object.entries(this.props.data);
    const rowsArr = [];
    columns.forEach((val, index) => {
      rowsArr.push(
        <InputCell
          key={index + '_inputCell'}
          data={val[1]}
          column={val[0]}
          onEnter={this.onEnter}
        />
      );
    });

    return <div>{rowsArr}</div>;
  }
}

export default Row;
