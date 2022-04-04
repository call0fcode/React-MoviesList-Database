import React, { useState, useEffect, useCallback } from 'react';

// Project components
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';

// 3rd party components
import Loader from 'react-spinners/PropagateLoader';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faThList } from '@fortawesome/free-solid-svg-icons';

// Project styles
import './App.css';

// 3rd party styles
import { css } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';

// Project files
import ReactLogo from './assets/React.svg';
import FirebaseLogo from './assets/Firebase.svg';

const override = css`
  display: block;
  height: 10px;
`;

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const successNotify = message =>
    toast.success(message, {
      position: 'top-right',
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const errorNotify = message =>
    toast.error(message, {
      position: 'top-right',
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const fetchMoviesHandler = useCallback(async action => {
    // Remove some posible previous error
    setError(null);

    // Show loading spinner
    setLoading(true);

    try {
      const response = await fetch(
        'https://c0c-react-db-connection-default-rtdb.firebaseio.com/movies.json'
      );

      // Throw error if response is 4xx, 5xx, etc
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
      if (action === 'refresh') {
        setTimeout(() => {
          setLoading(false);
          successNotify('Movies list updated!');
        }, 1500);
      }
    } catch (error) {
      setError(error);
      return null;
    }

    // Hide loading spinner
    if (action === 'delete' || action === 'add') {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = null;

  if (loading) {
    content = (
      <section>
        <p className='loading-paragraph'>Fetching movies</p>
        <Loader color='#230052' loading={loading} css={override} />
      </section>
    );
  }

  if (error) {
    content = (
      <section>
        <p>{error.message}</p>
      </section>
    );
  }

  if (!loading && movies.length === 0 && !error) {
    content = (
      <section>
        <p>No movies found!</p>
      </section>
    );
  }

  if (!loading && movies.length > 0) {
    content = (
      <section>
        <MoviesList
          movies={movies}
          fetchMoviesHandler={fetchMoviesHandler}
          successNotify={successNotify}
        />
      </section>
    );
  }

  const MAX_MOVIES_IN_LIST = 5;

  async function addMovieHandler(movie) {
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

    // Check if movies limit has been reached before add new movie
    if (moviesCount < MAX_MOVIES_IN_LIST) {
      try {
        // Add movie
        await fetch(
          'https://c0c-react-db-connection-default-rtdb.firebaseio.com/movies.json',
          {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Update movies count
        await fetch(
          'https://c0c-react-db-connection-default-rtdb.firebaseio.com/moviesCount.json',
          {
            method: 'PUT',
            body: JSON.stringify(moviesCount + 1),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        successNotify('Movie successfully added to database');
        fetchMoviesHandler('add');
      } catch (error) {
        console.log(error);
      }
    } else {
      errorNotify(
        `Limit of movies (${MAX_MOVIES_IN_LIST}) reached on database.`
      );
    }
  }

  async function clearListHandler() {
    try {
      // Delete movies endpoint
      await fetch(
        `https://c0c-react-db-connection-default-rtdb.firebaseio.com/movies.json`,
        {
          method: 'DELETE',
        }
      );
    } catch (error) {
      console.log(error);
    }

    try {
      // Update movies count
      await fetch(
        'https://c0c-react-db-connection-default-rtdb.firebaseio.com/moviesCount.json',
        {
          method: 'PUT',
          body: JSON.stringify(0),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      successNotify('Movies list successfully cleared');
      fetchMoviesHandler('delete');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <React.Fragment>
      <ToastContainer
        position='top-right'
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className='title'>
        <p>Communicating Frontend with Database</p>
        <p>
          React
          <img src={ReactLogo} alt='React Logo' className='logo' />
          + Firebase
          <img src={FirebaseLogo} alt='Firebase Logo' className='logo' />
        </p>
      </div>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section className='buttons-section'>
        <button onClick={() => fetchMoviesHandler('refresh')}>
          <span className='btn-text'>Refresh movies list</span>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
        <button onClick={clearListHandler}>
          <span className='btn-text'>Clear movies list</span>
          <FontAwesomeIcon icon={faThList} />
        </button>
      </section>
      {content}
    </React.Fragment>
  );
}

export default App;
