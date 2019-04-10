import React, { Component } from "react";
import './Matches.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context';


class MatchesPage extends Component {
  state = {
    creating: false,
    matches: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchMatches();
  }

  handleCreateMatch = () => {
    this.setState({ creating: true });
  };

  handleOnConfirm = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const match = { title, price, date, description };
    console.log(match);

    const requestBody = {
      query: `
          mutation {
            createMatch(matchInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.fetchMatches();
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleOnCancel = () => {
    this.setState({ creating: false });
  };

  fetchMatches() {
    const requestBody = {
      query: `
          query {
            matches {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const matches = resData.data.matches;
        this.setState({ matches: matches });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const matchesList = this.state.matches.map(match => {
      return (
        <li key={match._id} className="matches__list-item">
          {match.title}
        </li>
      );
    });

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
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="matches-control">
            <p className="">Create a new match!</p>
            <button className="btn" onClick={this.handleCreateMatch}>
              Create Match
            </button>
          </div>
        )}
        <ul className="matches__list">
          {matchesList}
        </ul>
      </React.Fragment>
    );
  }
}

export default MatchesPage;
