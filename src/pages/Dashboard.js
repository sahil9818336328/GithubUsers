import React from "react";
import { Info, Repos, User, Search, Navbar } from "../components";
// import loadingImage from "../images/preloader.gif";
import loading from "../images/Magnify-1s-200px.gif";
import { useGithubContext } from "../context/context";
const Dashboard = () => {
  const { isLoading } = useGithubContext();

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <Search />
        <img src={loading} alt="loading" className="loading-img" />
      </main>
    );
  }
  return (
    <main>
      <Navbar />
      <Search />
      <Info />
      <User />
      <Repos />
    </main>
  );
};

export default Dashboard;
