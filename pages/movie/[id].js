import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";
import Navbar from "../components/Navbar";

export default function Movie() {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [favorites, setFavorites] = useState([]);
  const [rating, setRating] = useState(() => {
    if (typeof window !== "undefined") {
      const storedRating = window.localStorage.getItem(`rating-${id}`);
      return storedRating ? Number(storedRating) : 0;
    }
    return 0;
  });


  function goBack() {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  function addToFavorites(movie) {
    setFavorites([...favorites, movie]);
  }

  function removeFromFavorites(movieId) {
    setFavorites(favorites.filter((movie) => movie.id !== movieId));
  }

  function updateRating(value) {
    setRating(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`rating-${id}`, value);
    }
  }

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
        const trailerObj =
          data.results &&
          data.results.find(
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
          <BackButton onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </BackButton>
          <Title>{movie.title}</Title>
          <Overview>{movie.overview}</Overview>
          <ReleaseDate>{movie.release_date}</ReleaseDate>
          <Img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            width="300"
            height="300"
            alt={movie.title}
          />
  
          <Heading>Trailer:</Heading>
          <YouTube videoId={trailer.key} opts={opts} />
  
          <Heading>Rating:</Heading>
          <div>
        {[1, 2, 3, 4, 5].map((value) => (
         <Star
         key={value}
         icon={faStar}
         className={value <= rating ? "active" : ""}
         onClick={() => updateRating(value)}
       />
        ))}
      </div>
          <Heading>Cast:</Heading>
          <CastList>
            {credits.cast &&
              credits.cast.map((actor) => (
                <li key={actor.credit_id}>
                  {actor.name} ({actor.character})
                </li>
              ))}
          </CastList>
  
        </div>
        <Navbar />
      </Container>
    );
  }
  
  const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding-top: 2rem;
    padding-bottom: 60px;
    color: #34495e;
    font-family: "Roboto", sans-serif;
  `;
  
  const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #34495e;
  
    &:hover {
      color: #2c3e50;
    }
  `;
  
  const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 1rem;
  `;
  
  const Overview = styled.p`
    font-size: 1.2rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  `;
  
  const ReleaseDate = styled.p`
    font-size: 1rem;
    margin-bottom: 1rem;
  `;
  
  const Img = styled.img`
    max-width: 300px;
    margin-bottom: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  `;
  
  const Heading = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #34495e;
    margin-bottom: 1rem;
  `;
  
  const CastList = styled.ul`
    display: grid;
    grid-template-columns:
    repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  
    li {
      background-color: #f0f0f0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      padding: 1rem;
      text-align: center;
  
      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 0.5rem;
      }
  
      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        font-weight: bold;
        color: #34495e;
      }
  
      p {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: #2c3e50;
      }
    }
  `;
  
  const TrailerWrapper = styled.div`
    position: relative;
    padding-bottom: 56.25%;
    margin-bottom: 1rem;
  `;
  
  const Trailer = styled(YouTube)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  `;

  const Star = styled(FontAwesomeIcon)`
  color: #cccccc;
  cursor: pointer;

  &.active {
    color: #ffd700;
  }

  &:hover {
    color: #ffd700;
  }
`;

  
