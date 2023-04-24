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
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <Container>
      <BackButton onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </BackButton>
      <ContentWrapper>
        <Title>{movie.title}</Title>
        <Overview>{movie.overview}</Overview>
        <ReleaseDate>{movie.release_date}</ReleaseDate>
        <ImageContainer>
          <Img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            width="100%"
            height="auto"
            alt={movie.title}
          />
        </ImageContainer>

        <Heading>Rating:</Heading>
        <StarContainer>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              icon={faStar}
              className={value <= rating ? "active" : ""}
              onClick={() => updateRating(value)}
            />
          ))}
        </StarContainer>

        <Heading>Cast:</Heading>
        <CastList>
          {credits.cast &&
            credits.cast.map((actor) => (
              <li key={actor.credit_id}>
                {actor.name} ({actor.character})
              </li>
            ))}
        </CastList>

        <Heading>Trailer:</Heading>
        <TrailerContainer>
          <ResponsiveYouTube videoId={trailer.key} opts={opts} />
        </TrailerContainer>
      </ContentWrapper>
      <Navbar />
    </Container>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 60px;
  color: #34495e;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  &:hover {
    color: #2c3e50;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 1rem;
  text-align: center;
`;

const Overview = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: justify;
`;

const ReleaseDate = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Img = styled.img`
  max-width: 300px;
  margin-bottom: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 1rem;
  text-align: center;
`;

const CastList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding-inline-start: 0;

  li {
    background-color: #f0f0f0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 1rem;
    text-align: center;
    list-style-type: none;
  }
`;

const ResponsiveYouTube = styled(YouTube)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TrailerWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  margin-bottom: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
  display: grid;
  place-items: center;

  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const TrailerContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
  max-width: 1000px;
  padding-bottom: 56.25%;
  position: relative;
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    max-width: 100%;
    padding-bottom: 56.25%;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ResponsiveTrailer = styled(YouTube)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Star = styled(FontAwesomeIcon)`
  color: #cccccc;
  cursor: pointer;
  margin: 0 5px;

  &.active {
    color: #ffd700;
  }

  &:hover {
    color: #ffd700;
  }
`;
