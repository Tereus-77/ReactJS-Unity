import React from 'react';

// Constants
import { JOKES } from "../../constants/common";

// Style
import './styles.scss';

function Quote() {
  const index = Math.floor(Math.random() * JOKES.length);
  const joke = JOKES[index].description.map((text, id) => {
    return <p className="para-small-margin" key={id}>{text}</p>
  })

  return <div className="quote-wrapper">
    <div className="quote-box"><i className="fas fa-quote-left fa2"></i>
      <div className="quote-text"><i className="fas fa-quote-right fa1"></i>
        <div className="joke-wrapper">
          <h3>Random Sock Joke</h3>
          <div className="joke-content">{joke}</div>
        </div>
      </div>
    </div>
  </div>
}

export default Quote;