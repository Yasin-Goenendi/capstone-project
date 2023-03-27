import Link from "next/link";
import styled from "styled-components";
import { FaHome, FaSearch, FaHeart } from "react-icons/fa";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;

  button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export default function Navbar() {
  return (
    <Nav>
      <Link href="/">
        <button>
          <FaHome />
        </button>
      </Link>
      <Link href="/MoviesSearchPage">
        <button>
          <FaSearch />
        </button>
      </Link>
      <Link href="/favorites">
        <button>
          <FaHeart />
        </button>
      </Link>
    </Nav>
  );
}
