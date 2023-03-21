import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function Movie() {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null); // Hinzugefügter Zustand
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchMovie() {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
      );
      const data = await response.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    // Hinzugefügter Effekt
    async function fetchCredits() {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`
      );
      const data = await response.json();
      setCredits(data);
    }
    fetchCredits();
  }, [id]);

  if (!movie || !credits) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        width="300"
        height="300"
        alt={movie.title}
      />

      <h2>Cast:</h2>
      <ul>
        {credits.cast.map((actor) => (
          <li key={actor.credit_id}>
            {actor.name} ({actor.character})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Movie;
