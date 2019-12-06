// This component creates each cell for the column names

import React, { Component } from 'react';

class HeaderCell extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const tableHeaderStyle = {
      background: '#d6e0f5',
      fontSize: '12px',
    };
    return (
      <input
        placeholder={this.props.data}
        type="text"
        name={this.props.column}
        onClick={this.props.handleEvent}
        style={tableHeaderStyle}
      />
    );
  }
}

export default HeaderCell;
