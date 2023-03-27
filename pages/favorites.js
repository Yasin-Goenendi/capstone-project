import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/Navbar";

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
`;

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <main>
      <button onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <Container>
        <Heading>Favorites</Heading>
        {favorites.map((favorite) => (
          <div key={favorite.id}>
            <h2>{favorite.title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`}
              alt={favorite.title}
            />
          </div>
        ))}
      </Container>
      <Navbar />
    </main>
  );
}
