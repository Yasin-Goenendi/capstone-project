import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/Navbar";
import { FaHeart } from "react-icons/fa";

export default function MoviesSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);
  
  function toggleFavorite(movie) {
    const currentFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
  
    if (currentFavorites.some((fav) => fav.id === movie.id)) {
      const updatedFavorites = currentFavorites.filter(
        (fav) => fav.id !== movie.id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = [...currentFavorites, movie];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  }

  useEffect(() => {
    const lastSearch = sessionStorage.getItem("lastSearch");
    if (lastSearch) {
      setQuery(lastSearch);
      handleSearch(null, lastSearch);
    }
  }, []);

  async function handleSearch(event, storedQuery) {
    if (event) event.preventDefault();
    const searchQuery = storedQuery || query;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${searchQuery}&page=1-20`
    );
    const data = await response.json();
    setResults(data.results);

    if (!storedQuery) {
      updateSearchHistory(searchQuery);
    }
  }

  function updateSearchHistory(searchTerm) {
    sessionStorage.setItem("lastSearch", searchTerm);
  }

  return (
    <Container>
      <BackButton onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </BackButton>
      <Heading>Search Movies</Heading>

      <Form onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder="Search for a movie"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit">Search</Button>
      </Form>

      {results.length > 0 && (
  <ResultsContainer>
    {results.map((movie) => {
      const isFavorite = favorites.some((fav) => fav.id === movie.id);
      return (
        <Link
          href={`/movie/${movie.id}`}
          key={movie.id}
          scroll={false}
          replace
        >
          <ResultCard>
            <ResultImage
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <TitleContainer>
              <h2>{movie.title}</h2>
              <FavoriteButton
                aria-label={
                  isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                aria-pressed={isFavorite}
                isFavorite={isFavorite}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(movie);
                }}
              >
                <FaHeart />
              </FavoriteButton>
            </TitleContainer>
          </ResultCard>
        </Link>
      );
    })}
  </ResultsContainer>
)}


      <Navbar />
    </Container>
  );
}


const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1e2a3a;

  &:hover {
    color: #233142;
  }
`;
const Container = styled.div`
  max-width: 320px;
  margin: 0 auto;
  padding-top: 5rem;
  padding-bottom: 60px;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1e2a3a;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
`;

const Button = styled.button`
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  background-color: #0070f3;
  color: white;
  cursor: pointer;
  margin-left: 1rem;

  &:hover {
    background-color: #0060c0;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 1rem;
  background: linear-gradient(to bottom, #ff8a80, #e53935);
  padding: 1rem;
  border-top: 1px solid #ddd;
`;


const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ResultImage = styled.img`
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.2rem;
  margin: 0;
`;

const FavoriteButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: ${({ isFavorite }) => (isFavorite ? "#f50057" : "#777")};

  &:hover {
    color: ${({ isFavorite }) => (isFavorite ? "#c51162" : "#777")};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
`;
