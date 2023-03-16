import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    async function fetchMovieDetails() {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
      );
      const movieData = await movieResponse.json();
      setMovie(movieData);

      const castResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
      );
      const castData = await castResponse.json();
      setCast(castData.cast);
    }
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        width="300"
        height="300"
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <p>Release date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>

      <h3>CAST:</h3>
      <ul>
        {cast.map((actor) => (
          <li key={actor.id}>{actor.name}</li>
        ))}
      </ul>

      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}

export default MovieDetails;
