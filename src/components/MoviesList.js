import React from 'react';

import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = props => {
  return (
    <ul className={classes['movies-list']}>
      {props.movies.map(movie => (
        <Movie
          key={movie.id}
          dbID={movie.id}
          title={movie.title}
          releaseDate={movie.release}
          openingText={movie.openingText}
          fetchMoviesHandler={props.fetchMoviesHandler}
          successNotify={props.successNotify}
        />
      ))}
    </ul>
  );
};

export default MovieList;
