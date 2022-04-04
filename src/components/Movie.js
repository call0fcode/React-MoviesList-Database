import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import classes from './Movie.module.css';

const Movie = props => {
  async function deleteHandler(movieID) {
    try {
      // Delete movie
      await fetch(
        `https://c0c-react-db-connection-default-rtdb.firebaseio.com/movies/${movieID}.json`,
        {
          method: 'DELETE',
        }
      );

      let moviesCount;

      // Get the count of movies in database
      try {
        const response = await fetch(
          'https://c0c-react-db-connection-default-rtdb.firebaseio.com/moviesCount.json'
        );

        moviesCount = await response.json();
      } catch (error) {
        console.log(error);
      }

      // Update movies count
      await fetch(
        'https://c0c-react-db-connection-default-rtdb.firebaseio.com/moviesCount.json',
        {
          method: 'PUT',
          body: JSON.stringify(moviesCount - 1),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      props.successNotify('Movie successfully deleted from database');
      props.fetchMoviesHandler('delete');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <li className={classes.movie} key={props.dbID}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={() => deleteHandler(props.dbID)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </li>
  );
};

export default Movie;
