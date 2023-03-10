import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  const [movieName, setMovieName] = useState("");
  const [review, setReview] = useState("");
  const [movieReviewList, setMovieList] = useState([])
  const [currentMovie, setCurrentMovie] = useState(null);

  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      setMovieList(response.data)
    });
  }, []);

  const submitReview = () => {
    Axios.post('http://localhost:3001/api/insert', {
      movieName: movieName, 
      movieReview: review,
  });

  setMovieList([
      ...movieReviewList, 
      { movieName: movieName, movieReview: review},
    ]);
  };

  const deleteReview = (movie) => {
    Axios.delete(`http://localhost:3001/api/delete/${movie}`).then(() => {
      setMovieList(
        movieReviewList.filter((val) => {
          return val.movieName !== movie;
        })
      );
    });
  };

  const updateReview = (movie) => {
    Axios.put("http://localhost:3001/api/update", {
      movieName: movie,
      movieReview: newReview, 
    });
    setNewReview("")
  }

  const showRandomMovie = () => {
    const randomIndex = Math.floor(Math.random() * movieReviewList.length);
    setCurrentMovie(movieReviewList[randomIndex]);
  }


  return (
    <div className="App">

      {/* title  */}
      <h1>Date Night Movie List</h1>
      <aside>This is where we will put movies on our watch list:<br/>Once the movie is complete, either delete it or update it to say "Favorited".</aside>

      {/* shuffle container  */}
      <aside className='shuffleContainer'>
        <h3>Shuffle Box</h3>
        <button className='shuffleButton' onClick={showRandomMovie}/>
        {currentMovie && (
          <div>
            <h4>{currentMovie.movieName}</h4>
            <p>{currentMovie.movieReview}</p>
          </div>
        )}
      </aside>


      <div className='form'>
        

        <label>Movie Name:</label>
        <textarea 
          type="text" 
          name="movieName" 
          onChange={(e) => {
            setMovieName(e.target.value);
          }}
        />
        <label>Review:</label>
        <textarea 
          type="text" 
          name="review" 
          onChange={(e) => {
            setReview(e.target.value);
          }}
        />

        <button onClick={submitReview} id="submitButton">Submit</button>
        <button onClick={showRandomMovie}>Shuffle</button>

        {movieReviewList.map((val) => {
          return (
          <div className='card'>
            <h1>{val.movieName}</h1>
            <p>{val.movieReview}</p>

            <button id='deleteButton' onClick={() => {deleteReview(val.movieName)}}>Delete</button>

            <textarea type='text' id='updateInput' onChange={(e) => {
              setNewReview(e.target.value)
            }}/>
            
            <button id='updateButton' onClick={() => {updateReview(val.movieName)}}>Update</button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
