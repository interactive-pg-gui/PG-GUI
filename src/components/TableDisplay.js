import React from 'react';
import Row from './Rows.js';
import TableHeader from './TableHeader.js';
import CreatePopup from './createPopup.js';

class TableDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
    this.togglePopup = this.togglePopup.bind(this);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  render() {
    const lengthRow = this.props.data.length;
    const rowsArr = [];
    const boxShadow = {
      boxShadow:
        '0px 0px 20px rgba(0,0,0,0.10), 0px 10px 20px rgba(0,0,0,0.05), 0px 20px 20px rgba(0,0,0,0.05), 0px 30px 20px rgba(0,0,0,0.05)',
      display: 'inline-block',
    };

    for (let i = 0; i < lengthRow; i += 1) {
      rowsArr.push(
        <Row
          key={`${i}_row`}
          reRender={this.props.reRender}
          tableName={this.props.tableName}
          uri={this.props.uri}
          data={this.props.data[i]}
        />,
      );
    }

    return (
      <div className="flex">
        <button onClick={this.togglePopup}>Create Row</button>
        {this.state.showPopup ? (
          <CreatePopup
            closePopup={this.togglePopup}
            keys={Object.keys(this.props.data[0])}
            reRender={this.props.reRender}
            tableName={this.props.tableName}
            uri={this.props.uri}
          />
        ) : null}
        <br />
        <div style={boxShadow}>
          <TableHeader
            keys={Object.keys(this.props.data[0])}
            reRender={this.props.reRender}
            tableName={this.props.tableName}
            currentLimit={this.props.currentLimit}
            uri={this.props.uri}
          />
          {rowsArr}
        </div>
      </div>
    );
  }
}

export default TableDisplay;
