import React, { useState, useEffect, useCallback } from 'react';

// Project components
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';

// 3rd party components
import Loader from 'react-spinners/PropagateLoader';
import { ToastContainer, toast } from 'react-toastify';

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

  const fetchMoviesHandler = useCallback(async (buttonIsClicked = false) => {
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

      if (buttonIsClicked) successNotify('Movies list updated!');
      setMovies(loadedMovies);
    } catch (error) {
      setError(error);
    }

    // Hide loading spinner in all cases (success or error)
    setLoading(false);
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

  async function addMovieHandler(movie) {
    try {
      const response = await fetch(
        'https://c0c-react-db-connection-default-rtdb.firebaseio.com/movies.json',
        {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        successNotify('Movie successfully added to database');
        fetchMoviesHandler();
      }
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
      <section>
        <button onClick={() => fetchMoviesHandler(true)}>
          Refresh movies list
        </button>
      </section>
      {content}
    </React.Fragment>
  );
}

export default App;
