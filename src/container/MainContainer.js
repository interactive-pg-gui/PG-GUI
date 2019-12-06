import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userInfo } from 'os';
import TableDisplay from '../components/TableDisplay';
import { update } from '../actions/actions.js';
import UserInfo from '../components/userInfo';

const mapDispatchToProps = dispatch => ({
  update: () => dispatch(update())
});

// Create container. This is the main parent.
class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      uri: '',
      tableNames: [],
      isLoading: true,
      currentTable: '',
      currentLimit: '',
      username: '',
      password: '',
      authToggle: 'login',
      failedLog: false,
      databaseResponseArray: []
    };
    this.getTable = this.getTable.bind(this);
    this.getTableNames = this.getTableNames.bind(this);
    this.reRender = this.reRender.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleFailedLogin = this.toggleFailedLogin.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.signupUser = this.signupUser.bind(this);
  }

  // login with Github, etc. (oAuth buttons) --> should just intitate the fetch to their server route

  // The following are METHODS used THROUGHOUT the APP ///
  // There are only a few methods not contained in here.
  // update method which was dispatched to here for fun/learning. and a eventHandler on HeaderCell file.
  getTable() {
    // Get required data to build queryString to query database
    const { uri } = this.state;
    const tableName = document.querySelector('#selectedTable').value;
    const limitNum = document.querySelector('#selectedLimit').value;
    const queryString = `select * from ${tableName} limit ${limitNum}`;
    const data = { uri, queryString };

    // send URI and queryString in a post request
    fetch('/server/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          data: result,
          isLoading: false,
          currentTable: tableName,
          currentLimit: limitNum
        });
      });
  }

  getTableNames() {
    const uri = document.querySelector('#uri').value;
    this.setState({ uri });
    const data = { uri };
    fetch('/server/tablenames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        console.log('result');
        console.log(result);
        const { tableName } = result;
        const titlesArray = [];
        console.log(result);
        tableName.forEach(el => {
          if (el.tablename.slice(0, 4) !== 'sql_') {
            titlesArray.push(el.tablename);
          }
        });
        this.setState({ tableNames: titlesArray });
      });
  }

  // this method pulls the username and password entered by the user from state and
  loginUser() {
    // event.preventDefault();
    const { username, password } = this.state;
    const userLogInfo = { username, password };
    console.log(userLogInfo);
    fetch('/server/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userLogInfo)
    })
      // this is where the auth will take place to make sure users are logged in to the right session

      .then(response => response.json())
      .then(data => {
        console.log('Login Successful ', data);
      })

      // Also, an error here could mean the user doesnt exist yet so maybe we could redirect them to a signup page or
      // make another fetch request to create an account for them with the already passed in username and password
      .catch(error => {
        console.log(console.log('Error: Login Unsuccessful', error));
        this.toggleFailedLogin();
      });
  }

  signupUser() {
    // event.preventDefault();
    const { username, password } = this.state;
    const userLogInfo = { username, password };
    console.log(userLogInfo);
    fetch('/server/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userLogInfo)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          databaseResponseArray: data,
          authToggle: 'verified'
        });
      })
      .catch(error => {
        console.log(console.log('Error: Could not create user.', error));
      });
  }

  toggleSignup(event) {
    event.preventDefault();
    this.setState({
      authToggle: 'signup',
      failedLog: false
    });
  }

  toggleLogin() {
    this.setState({
      authToggle: 'login'
    });
  }

  toggleFailedLogin() {
    this.setState({
      failedLog: true
    });
  }

  // add login method here -->username, email on the body
  handleUsernameChange(event) {
    if (event.target.value) {
      this.setState({
        username: event.target.value
      });
    }
  }

  handlePasswordChange(event) {
    if (event.target.value) {
      this.setState({
        password: event.target.value
      });
    }
  }

  displayUserInfo() {}

  // This method is called throughout the APP to reRender after doing something
  reRender(newString) {
    const tableName = this.state.currentTable;
    const { uri } = this.state;
    let queryString;

    // If no personalised query is send as an arg do normal default query
    if (newString !== undefined) {
      queryString = newString;
    } else {
      queryString = `select * from ${tableName}`;
    }
    // console.log('**********************************', queryString)
    const tableData = { uri, queryString };
    this.setState({ isLoading: true });

    // First fetch is to get tableNames. sending a post request of the URI of the DB.
    // Second fetch request is to get the table specifying the tablename from the DB.

    fetch('/server/tablenames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri })
    })
      .then(res => res.json())
      .then(result => {
        const titlesArray = [];

        result.forEach(el => {
          if (el.tablename.slice(0, 4) !== 'sql_') {
            titlesArray.push(el.tablename);
          }
        });
        this.setState({ tableNames: titlesArray });
      })
      .then(() => {
        fetch('/server/table', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tableData)
        })
          .then(res => res.json())
          .then(result => {
            this.setState({
              data: result,
              isLoading: false,
              currentTable: tableName
            });
          });
      });
  }

  // Delete row method
  deleteRow() {
    const PK = Object.keys(this.state.data[0])[0];
    const PKValue = document.querySelector('#deleteRow').value;
    const queryString = `DELETE FROM ${this.state.currentTable} WHERE ${PK} = ${PKValue}`;
    const { uri } = this.state;

    fetch('/server/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri, queryString })
    }).then(() => {
      console.log('hi');
      this.reRender();
    });
  }

  // END OF METHODS //

  render() {
    const inputStyle = { margin: '10px', width: '500px' };
    const inputTableStyle = { margin: '10px', width: '100px' };
    const tableOptions = [];

    for (let i = 0; i < this.state.tableNames.length; i++) {
      tableOptions.push(
        <option key={`${i}_tableOptions`} value={this.state.tableNames[i]}>
          {this.state.tableNames[i]}
        </option>
      );
    }

    let tableArray = [];

    if (this.state.isLoading !== true) {
      tableArray = [
        <TableDisplay
          key={this.state.currentTable}
          tableName={this.state.currentTable}
          currentLimit={this.state.currentLimit}
          uri={this.state.uri}
          data={this.state.data}
          reRender={this.reRender}
        />
      ];
    }

    let loginPane;
    if (this.state.authToggle === 'login') {
      loginPane = (
        <div
          id="login_panel"
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'purple',
            width: '250px',
            height: '150px',
            borderRadius: '25px'
          }}
        >
          <input
            id="username"
            style={{ width: '100px' }}
            placeholder="username"
            onChange={this.handleUsernameChange}
            value={this.state.username}
          />
          <input
            id="password"
            style={{ width: '100px' }}
            placeholder="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
          <button
            type="submit"
            onClick={() => {
              this.loginUser();
            }}
          >
            Log In
          </button>
        </div>
      );
    } else if (this.state.authToggle === 'signup') {
      loginPane = (
        <div
          id="signup_panel"
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'purple',
            width: '250px',
            height: '150px',
            borderRadius: '25px'
          }}
        >
          <input
            id="username"
            style={{ width: '100px' }}
            placeholder="username"
            onChange={this.handleUsernameChange}
            value={this.state.username}
          />
          <input
            id="password"
            style={{ width: '100px' }}
            placeholder="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
          <button
            type="submit"
            onClick={() => {
              this.signupUser();
            }}
          >
            Signup
          </button>
        </div>
      );
    } else {
      loginPane = (
        <UserInfo
          username={this.state.username}
          databaseResponseArray={this.state.databaseResponseArray}
        />
      );
    }

    return (
      <div className="flex">
        {this.state.authToggle !== 'verified' ? (
          <div
            className="buttonBar"
            style={{
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button className="login" onClick={() => this.toggleLogin()}>
              Login
            </button>
            <button
              className="signup"
              onClick={event => this.toggleSignup(event)}
            >
              Signup
            </button>
          </div>
        ) : null}
        <div>{loginPane}</div>

        <div>
          <div style={{ maxWidth: '250px' }}>
            {this.state.failedLog ? (
              <p style={{ textOverflow: 'wrap', fontSize: '1em' }}>
                No dice. Did you mean to{' '}
                <a href="" onClick={event => this.toggleSignup(event)}>
                  sign up
                </a>
                ?
              </p>
            ) : null}
          </div>

          <div>
            {this.state.authToggle !== 'verified' ? (
              <button
                style={{ display: 'block' }}
                type="submit"
                onClick={() => this.oAuthLogin()}
              >
                GitHub Login
              </button>
            ) : null}
          </div>
        </div>

        <span>
          <label>Place URI Here:</label>

          <input id="uri" style={inputStyle} placeholder="progres://" />
          <div>
            {this.state.authToggle === 'verified' ? (
              <div>
                <label>Save URI Label Here:</label>

                <input
                  id="queryname"
                  style={{ margin: '10px', width: '100px' }}
                  placeholder="URI Label Here"
                />
              </div>
            ) : null}
          </div>

          <button type="submit" onClick={() => this.getTableNames()}>
            Get Tables
          </button>
        </span>
        <br />
        <span>
          <label>Table Name</label>
          <select id="selectedTable" style={inputTableStyle}>
            {tableOptions}
          </select>
          <label>Limit</label>
          <select id="selectedLimit" style={inputTableStyle}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>

          <button type="submit" onClick={() => this.getTable()}>
            Get Data
          </button>
        </span>
        <br />
        <span>
          <label>Delete a Row (Insert id):</label>
          <input style={inputTableStyle} id="deleteRow" />
          <button type="submit" onClick={this.deleteRow}>
            Delete
          </button>
        </span>
        <h2>{this.state.currentTable}</h2>
        <div>{tableArray}</div>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(MainContainer);
