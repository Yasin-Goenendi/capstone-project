import styled from "styled-components";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaSearch, FaHeart } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Head from "next/head";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
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

  function addToFavorites(movie) {
    const currentFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = [...currentFavorites, movie];
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <MainContainer>
        <Heading>Movie4U</Heading>
        <SubHeading>Popular films</SubHeading>
        <Container>
          <MoviesWrapper>
            {movies?.length > 0 &&
              movies.map((movie, index) => {
                const isFavorite = favorites.some((fav) => fav.id === movie.id);

                return (
                  <Link href={`/movie/${movie.id}`} key={movie.id} passHref>
                    <MovieCard>
                      <MovieCardContent>
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={`${movie.title} movie poster`}
                          width={100}
                          height={150}
                          fit="cover"
                          style={{ width: "auto", height: "auto" }}
                        />
                        <MovieInfo>
                          <MovieTitle>{movie.title}</MovieTitle>
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
                        </MovieInfo>
                      </MovieCardContent>
                    </MovieCard>
                  </Link>
                );
              })}
          </MoviesWrapper>

          <Navbar />
        </Container>
      </MainContainer>
    </>
  );
}

const MainContainer = styled.main`
  background-color: #dde6f0;
  font-family: "Roboto", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavItem = styled.div`
  margin-right: 1rem;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;

const SearchBar = styled.input`
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
`;

const Container = styled.div`
  max-width: 320px;
  margin: 0 auto;
  padding-top: 5rem;
  padding-bottom: 60px;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin: 2rem 0 1rem;
  color: #1e2a3a;
`;

const SubHeading = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1e2a3a;
`;

const SearchButton = styled.button`
  font-size: 1rem;
  padding: 0.8rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const MoviesWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: 60px;
  position: sticky;
  bottom: 0;
  background: linear-gradient(to bottom, #ff8a80, #e53935);
  z-index: 10;
  padding: 1rem;
  border-top: 1px solid #ddd;
`;

const MovieCardContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.5rem;
  background-color: #fffde7;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 1rem;
`;

const MovieTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0.5rem 0;
  font-weight: bold;
  color: #1e2a3a;
  text-align: center;
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

const MovieCard = styled.div`
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  padding: 1rem;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    font-size: 1rem;
    margin: 0.3rem 0;
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
`;

const ButtonsWrapper = styled.div`
  pointer-events: none;
  z-index: 100;
`;
