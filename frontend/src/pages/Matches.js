import React, { Component } from "react";
import './Matches.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'


class MatchesPage extends Component {

  state = {
    creating: false
  }

  handleCreateMatch = () => {
    this.setState({creating: true});
  }

  handleOnCancel= () => {
    this.setState({creating: false})
  }
  handleOnConfirm= () => {
    this.setState({creating: false})
  }
  
  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Create match"
            canCancel
            canConfirm
            onCancel={this.handleOnCancel}
            onConfirm={this.handleOnConfirm}
          >
            <p className="">Modal content</p>
          </Modal>
        )}
        <div className="matches-control">
          <p className="">Create a new match!</p>
          <button className="btn" onClick={this.handleCreateMatch}>
            Create Match
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default MatchesPage;
