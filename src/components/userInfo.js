import React, { Component } from 'react';

class UserInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const userURIs = this.props.databaseResponseArray;
    const uriArray = [];
    const displayArray = [];

    for (let i = 0; i < userURIs.length; i++){
      uriArray.push(Object.entries(userURIs[i]));
    }

    for (let j = 0; j < uriArray; j++){
      displayArray.push(
        <option onClick={() => this.props.populateUserURIs(userURIs[j][1]) } uri={userURIs[j][1]}>{userURIs[j][0]}</option>
      )
    }

    return (
      <div style={{width: "200px", height: "40px", backgroundColor: "purple", display: "flex", justifyContent: "space-between"}}>
        <span style={{fontWeight: "bolder", fontFamily: "Arial", fontSize: "2em"}}>{this.props.username}</span>
        <div>
          <select name="Your Databases" readOnly={true}>
            {displayArray}
          </select>
        </div>
      </div>
    );
  }
}

export default UserInfo;
