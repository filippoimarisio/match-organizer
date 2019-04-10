import React from 'react';
import './MatchList.css';
import MatchItem from './MatchItem/MatchItem'

const matchList = props => {
  
  const matches = props.matches.map(match => {
    return (
      <MatchItem 
        key={match._id} 
        matchId={match._id} 
        title={match.title}
        price={match.price}
        date={match.date} 
        userId={props.authUserId}
        creatorId={match.creator._id}
        onDetail ={props.onViewDetail}
      />
    );
  })
  return (
    <ul className="match__list">
      {matches}
    </ul>
  )
}

export default matchList