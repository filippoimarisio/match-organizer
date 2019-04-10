import React, { Component } from "react";
import './Matches.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context';
import MatchList from '../components/Matches/MatchList/MatchList';
import Spinner from '../components/Spinner/Spinner';


class MatchesPage extends Component {
  state = {
    creating: false,
    matches: [],
    isLoading: false,
    selectedMatch: null
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
        this.setState(prevState => {
          const updatedMatches = [...prevState.matches];
          console.log('resdata', resData)
          updatedMatches.push({
            _id: resData.data.createMatch._id,
            title: resData.data.createMatch.title,
            description: resData.data.createMatch.description,
            date: resData.data.createMatch.date,
            price: resData.data.createMatch.price,
            creator: {
              _id: this.context.userId
            }
          })
          return {matches: updatedMatches};
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleOnCancel = () => {
    this.setState({ creating: false, selectedMatch: null });
  };

  fetchMatches() {
    this.setState({isLoading: true});
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
        this.setState({ matches: matches, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  handleShowDetail = matchId => {
    this.setState(prevState => {
      const selectedMatch = prevState.matches.find(m => m._id === matchId);
      return {selectedMatch : selectedMatch};
    })
  }

  render() {

    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedMatch) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Create match"
            canCancel
            canConfirm
            onCancel={this.handleOnCancel}
            onConfirm={this.handleOnConfirm}
            confirmText='Confirm'
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
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateElRef}
                />
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
        {this.state.selectedMatch && (
          <Modal
            title={this.state.selectedMatch.title}
            canCancel
            canConfirm
            onCancel={this.handleOnCancel}
            onConfirm={this.handleBookMatch}
            confirmText='Book'
          >
            <h1>{this.state.selectedMatch.title}</h1>
            <h2>
              ${this.state.selectedMatch.price} -{" "}
              {new Date(this.state.selectedMatch.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedMatch.description}</p>
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
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <MatchList
            matches={this.state.matches}
            authUserId={this.context.userId}
            onViewDetail={this.handleShowDetail}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MatchesPage;
