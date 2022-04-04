import React, { useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import classes from './AddMovie.module.css';

function AddMovie(props) {
  const titleRef = useRef('');
  const openingTextRef = useRef('');
  const releaseDateRef = useRef('');

  const [formError, setFormError] = useState(false);

  function submitHandler(event) {
    event.preventDefault();

    // Clear possible previous errors
    setFormError(false);

    // Validation
    if (
      titleRef.current.value.trim() === '' ||
      openingTextRef.current.value.trim() === '' ||
      releaseDateRef.current.value.trim() === ''
    ) {
      setFormError(true);
      return null;
    }

    const movie = {
      title: titleRef.current.value,
      openingText: openingTextRef.current.value,
      releaseDate: releaseDateRef.current.value,
    };

    props.onAddMovie(movie);
  }

  return (
    <form onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='title'>Title</label>
        <input type='text' id='title' ref={titleRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor='opening-text'>Opening Text</label>
        <textarea rows='5' id='opening-text' ref={openingTextRef}></textarea>
      </div>
      <div className={classes.control}>
        <label htmlFor='date'>Release Date</label>
        <input type='date' id='date' ref={releaseDateRef} />
      </div>
      {formError && (
        <p className={classes['form-error']}>All fields are required</p>
      )}
      <button type='submit'>
        <span className='btn-text'>Add Movie</span>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}

export default AddMovie;
