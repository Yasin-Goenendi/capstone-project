import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Head from "next/head";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  function removeFromFavorites(favorite) {
    const updatedFavorites = favorites.filter((fav) => fav.id !== favorite.id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  }

  function MovieCardComponent({ favorite, removeFromFavorites }) {
    return (
      <MovieCardContent onClick={() => router.push(`/movie/${favorite.id}`)}>
        <img
          src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`}
          alt={favorite.title}
          style={{
            width: "100px",
            height: "150px",
            objectFit: "cover",
          }}
        />
        <MovieInfo>
          <MovieTitle>{favorite.title}</MovieTitle>
          <RemoveButton
            onClick={(event) => {
              event.stopPropagation();
              removeFromFavorites(favorite);
            }}
          >
            <FaTrash />
          </RemoveButton>
        </MovieInfo>
      </MovieCardContent>
    );
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
        <BackButton onClick={() => router.back()}>
          <FaArrowLeft />
        </BackButton>
        <Container>
          <Heading>Favorites</Heading>
          <MoviesWrapper>
            {favorites.map((favorite) => (
              <MovieCard key={favorite.id}>
                <MovieCardComponent
                  favorite={favorite}
                  removeFromFavorites={removeFromFavorites}
                />
              </MovieCard>
            ))}
          </MoviesWrapper>
        </Container>
        <Navbar />
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
  font-size: 2.5rem;
  margin: 2rem 0 1rem;
  color: #1e2a3a;
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
  background-color: #fff3e0;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
`;

const RemoveButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: #f44336;

  &:hover {
    color: #d32f2f;
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
`;
