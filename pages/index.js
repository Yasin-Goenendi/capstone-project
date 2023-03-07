import styled from "styled-components";
import { useEffect, useState } from "react";
import Image from "next/image";





export default function Home() {

  const [data, setData] = useState();


  const url = 'https://imdb8.p.rapidapi.com/auto-complete?q=marvel';

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '467e3c9b58mshc5c2a10984fd07bp15ceebjsn338c8a8d0154',
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    };

fetch(url, options)
.then(response => response.json())
.then(response => {
  console.log(response);
  setData(response);
})
.catch(err => {
  console.error(err);
})

  })

  return (
    <main>
      <Heading>Movies</Heading>
      <h1>Popular Films</h1>
      {
        data && data.map((id) => {
          return(
            <div key={id.id}>
            <h2>{id.name}</h2>
            {id.description}
            <Image src={id.imgSrc[0].img} width="50" height="50" alt={id.name} />
            

            </div>
          )
        })
      }

    </main>
  );
}

const Heading = styled.h1`
text-align: center;
`;

const h1 = styled.h2`
text-align: center;
`;
