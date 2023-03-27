import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
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
  display: flex;
  flex-wrap: wrap;
`;

const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  margin: 1rem;
`;

const ResultImage = styled.img`
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

export default function MoviesSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  async function handleSearch(event) {
    event.preventDefault();
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=1-20`
    );
    const data = await response.json();
    setResults(data.results);
  }

  return (
    <Container>
      <button onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
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
          {results.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <ResultCard>
                <ResultImage
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h2>{movie.title}</h2>
              </ResultCard>
            </Link>
          ))}
        </ResultsContainer>
      )}
      <Navbar />
    </Container>
  );
}
