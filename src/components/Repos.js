import React from "react";
import styled from "styled-components";
import { useGithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = useGithubContext();
  // console.log(repos);
  const languages = repos.reduce((total, CItem) => {
    const { language, stargazers_count } = CItem;
    // if language === null just return total
    if (!language) {
      return total;
    }
    // console.log(language);
    if (!total[language]) {
      // if language property does'nt exists create that property = object .
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      // if that property already exists simply return that property but modify the value OR increase the value by 1 if on the next interation the language is the same
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});
  // console.log(languages);
  // converting object to an array
  const mostUsed = Object.values(languages)
    // sorting items from high to low for checking which languages are used mostly and getting only first 5 most used languages through slice.
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  // most stars per language.
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    });
  // console.log(mostPopular);
  // console.log(languages);

  // stars , forks
  let { stars, forks } = repos.reduce(
    (total, Citem) => {
      const { stargazers_count, name, forks } = Citem;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );
  // console.log(stars, forks);
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();
  // console.log(stars, forks);
  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
