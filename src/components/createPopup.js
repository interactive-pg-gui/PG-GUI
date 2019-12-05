import React from 'react';
import TableHeader from './TableHeader.js';

class CreatePopup extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const getDataObj = {};

    for (let i = 1; i < this.props.keys.length; i += 1) {
      const inputData = data.get(this.props.keys[i]);

      if (inputData !== '') {
        getDataObj[this.props.keys[i]] = inputData;
      }
    }

    let columnNames = '';
    let columnValues = '';

    for (const keys in getDataObj) {
      columnNames += `${keys}, `;
      columnValues += `'${getDataObj[keys]}'` + ', ';
    }

    columnValues = columnValues.trim();
    columnNames = columnNames.trim();

    columnValues = columnValues.slice(0, -1);
    columnNames = columnNames.slice(0, -1);

    console.log(columnValues, columnNames);

    const queryString = `INSERT INTO ${this.props.tableName} (${columnNames}) values (${columnValues})`;
    const { uri } = this.props;

    console.log('THIS IS QUERYSTRNG', uri, queryString);

    fetch('/server/create', {
      method: 'POST',
      body: JSON.stringify({ uri, queryString }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => {
      console.log('post request on submit has completed');
      this.props.reRender();
    });
  }

  render() {
    const keysInputBoxes = [];
    for (let i = 1; i < this.props.keys.length; i += 1) {
      keysInputBoxes.push(
        <input
          type="text"
          tname={this.props.tableName}
          key={`${i}_inputBoxes`}
          uri={this.props.uri}
          id={this.props.keys[i]}
          name={this.props.keys[i]}
          placeholder={this.props.keys[i]}
        />,
      );
    }

    return (
      <div>
        <div className="flex">
          <h3>Create Row</h3>
          {/* <TableHeader keys={this.props.keys} tableName={this.props.tableName} uri={this.props.uri}/> */}
          <form className="flex" onSubmit={this.onSubmit}>
            {keysInputBoxes}
            <br />
            <button>Submit</button>
          </form>
          <br />
          <button onClick={this.props.closePopup}>Close</button>
        </div>
      </div>
    );
  }
}

export default CreatePopup;
