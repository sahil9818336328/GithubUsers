import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const Provider = GithubContext.Provider;

  //   STATE VARIABLES
  const [githubUser, setGithubUsers] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  // CHECK REMAINING REQUESTS
  const checkRequest = async () => {
    try {
      const response = await axios(`${rootUrl}/rate_limit`);
      let {
        data: {
          rate: { remaining },
        },
      } = response;
      // console.log(remaining);
      // remaining = 0;
      if (remaining === 0) {
        DisplayError(true, "sorry , you have exceeded your hourly rate limit!");
      }
      setRequests(remaining);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH USERS

  const searchGithubUsers = async (user) => {
    DisplayError();
    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error)
    );
    if (response) {
      // console.log(response);
      setGithubUsers(response.data);
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      alertify
        .alert("There is no user with that username")
        .set({ title: "Sorry!" });
    }
    checkRequest();
    setIsLoading(false);
  };

  function DisplayError(show = false, msg = "") {
    setError({ show, msg });
  }
  useEffect(() => {
    checkRequest();
  }, []);
  return (
    <Provider
      value={{
        githubUser,
        repos,
        followers,
        error,
        isLoading,
        requests,
        searchGithubUsers,
      }}
    >
      {children}
    </Provider>
  );
};

const useGithubContext = () => {
  return useContext(GithubContext);
};

export { GithubProvider, useGithubContext };
