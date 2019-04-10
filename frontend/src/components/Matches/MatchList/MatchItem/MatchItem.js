import React from 'react';
import './MatchItem.css';

const matchItem = props => (
  <li key={props.matchId} className="matches__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>You created this match</p> 
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.matchId)}>View details</button> 
      )}
    </div>
  </li>
);

export default matchItem