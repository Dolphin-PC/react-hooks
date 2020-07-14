import React, { useReducer, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Movie from "./components/Movie";
import Search from "./components/Search";

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=f6c77750";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then((res) => res.json())
      .then((jsonRes) => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonRes.Search,
        });
      });
  }, []);

  const search = (searchValue) => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST",
    });
    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=f6c77750`)
      .then((res) => res.json())
      .then((jsonRes) => {
        if (jsonRes.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonRes.Search,
          });
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonRes.Error,
          });
        }
      });
  };

  const { movies, errorMessage, loading } = state;
  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movie</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
