import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";
import Navbar from "../components/Navbar";

const Container = styled.div`
  max-width: 320px;
  margin: 0 auto;
  padding-top: 5rem;
  padding-bottom: 60px;
`;

export default function Movie() {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
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

  useEffect(() => {
    async function fetchTrailer() {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
      );
      const data = await response.json();
      const trailerObj = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      setTrailer(trailerObj);
    }
    fetchTrailer();
  }, [id]);

  if (!movie || !credits || !trailer) {
    return <div>Loading...</div>;
  }

  const opts = {
    height: "300",
    width: "300",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <Container>
      <div>
        <button onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <p>{movie.release_date}</p>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          width="300"
          height="300"
          alt={movie.title}
        />

        <h2>Trailer:</h2>
        <YouTube videoId={trailer.key} opts={opts} />

        <h2>Cast:</h2>
        <ul>
          {credits.cast &&
            credits.cast.map((actor) => (
              <li key={actor.credit_id}>
                {actor.name} ({actor.character})
              </li>
            ))}
        </ul>
      </div>
      <Navbar />
    </Container>
  );
}
