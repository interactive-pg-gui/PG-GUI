import React, {Component} from 'react';

class InputCell extends Component {
  constructor(props) {
    super(props) 

    this.state = {

    }
  }

  render () {
    const inputCellStyle = {
      fontSize: '12px'
    };
    return (
      <input style={inputCellStyle} placeholder={this.props.data} type="text" name={this.props.column} onKeyPress={this.props.onEnter}></input>
    );
  }
}

export default InputCell;