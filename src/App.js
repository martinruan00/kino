import React from 'react';
import logo from './logo.svg';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { Search } from './components/Search/Search.js';
import { MovieDetail } from './components/MovieDetail/MovieDetail';
import { UpcomingMovies } from './components/UpcomingMovies/UpcomingMovies';
import { SearchResult } from './components/SearchResult/SearchResult';

function App() {
    return (
        <div className="App container">
            <Router >
                <Search className="searchbar" />
                <Switch>
                    <Route exact path="/" component={UpcomingMovies} />
                    <Route exact path="/search-result" component={SearchResult} />
                    <Route exact path="/movie-detail/:id" component={MovieDetail} />
                </Switch>
            </Router >
        </div>
    );
}

export default App;