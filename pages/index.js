import styled from "styled-components";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();
      setMovies(data.results);
      console.log(data);
    }
    fetchMovies();
  }, []);

  function handleMovieClick(movie) {
    setSelectedMovie(movie);
  }

  return (
    <main>
      <Heading suppressHydrationWarning>Movies</Heading>

      <h1>Popular films</h1>
      <div className="movies">
        {movies?.length > 0 &&
          movies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div onClick={() => handleMovieClick(movie)}>
                <h2>{movie.title}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  width="300"
                  height="300"
                  alt={movie.title}
                />
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}

const Heading = styled.h1`
  text-align: center;
`;

export default MoviesList;
