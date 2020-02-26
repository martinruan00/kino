import React from 'react';
import omdbApiService from '../../services/OmdbApiService.js';
import movieTypes from '../../services/MovieTypes.js';
import './SearchResult.css';
import { MoviePreview } from '../MoviePreview/MoviePreview.js';

export class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            genres: [],
            allMovies: [],
            filteredMovies: [],
            selectedGenre: '',
            orderMoviesBy: ''
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    componentDidMount() {
        this.doSearch();
    }
    componentDidUpdate() {
        this.doSearch();
    }

    doSearch() {
        if (this.lastSearchValue == this.props.match.params.movie) {
            return;
        }

        this.lastSearchValue = this.props.match.params.movie;
        const moviePromises = this.props.match.params.movietypes.split(',').map(t => omdbApiService.searchByType(this.lastSearchValue, t));
        Promise.all(moviePromises)
            .then(responses => {
                let movieIDs = responses.filter(r => r.data.Response != "False").map(r => r.data.Search.map(s => s.imdbID)).flat();
                if (movieIDs.length == 0) {
                    this.setState({ allMovies: [], filteredMovies: [] });
                }
                Promise.all(movieIDs.map(id => omdbApiService.searchById(id)))
                    .then(response => {
                        const movies = response.map(r => r.data);
                        const genres = [...new Set(movies.map(m => m.Genre.split(',')).flat())];
                        genres.unshift('All');
                        this.setState({ allMovies: movies, filteredMovies: movies, genres: genres });
                    });
            })
            .catch(e => {
                console.log(e);
            });
    }

    applyFilter() {
        let processedMovies = this.state.allMovies.filter(m => this.state.selectedGenre == 'All' || m.Genre.indexOf(this.state.selectedGenre) > -1);
        switch (this.state.orderMoviesBy) {
            case orderMoviesBy.releasedDate:
                processedMovies = processedMovies.sort((a, b) => new Date(a.Released) < new Date(b.Released) ? -1 : 1);
                break;

            case orderMoviesBy.imdbRating:
                processedMovies = processedMovies.sort((a, b) => {
                    const aScore = a.Ratings.filter(r => r.Source == 'Internet Movie Database')[0]?.Value.split('/')[0] ?? "0";
                    const bScore = b.Ratings.filter(r => r.Source == 'Internet Movie Database')[0]?.Value.split('/')[0] ?? "0";
                    return parseFloat(aScore) < parseFloat(bScore) ? 1 : -1;
                });
                break;

            case orderMoviesBy.title:
                processedMovies = processedMovies.sort((a, b) => a.Title < b.Title ? - 1 : 1);
                break;
        }
        this.setState({ filteredMovies: processedMovies });
    }

    render() {
        return (
            <>
                <h1>Search result for "{this.props.match.params.movie}"</h1>
                <form className="form-inline">
                    <label htmlFor="genre" className="mr-2">Genre</label>
                    <select id="genre" className="form-control mr-2" value={this.state.selectedGenre} onChange={e => this.setState({ selectedGenre: e.target.value }, this.applyFilter)}>
                        {this.state.genres.map(g => (<option key={g} value={g}>{g}</option>))}
                    </select>
                    <div className="form-group">
                        <label htmlFor="order-result-by" className="mr-2">Order result by</label>
                        <select id="order-result-by" className="form-control  mr-2" value={this.state.orderMoviesBy} onChange={e => this.setState({ orderMoviesBy: e.target.value }, this.applyFilter)}>
                            <option key={orderMoviesBy.default.key} value={orderMoviesBy.default.key}>{orderMoviesBy.default}</option>
                            <option key={orderMoviesBy.releasedDate.key} value={orderMoviesBy.releasedDate.key}>{orderMoviesBy.releasedDate}</option>
                            <option key={orderMoviesBy.imdbRating.key} value={orderMoviesBy.imdbRating.key}>{orderMoviesBy.imdbRating}</option>
                            <option key={orderMoviesBy.title.key} value={orderMoviesBy.title.key}>{orderMoviesBy.title}</option>
                        </select>
                    </div>
                </form>
                {this.state.filteredMovies.map(m => (<MoviePreview movie={m} key={m.imdbID} />))}
            </>
        );
    }
}

const orderMoviesBy = {
    "default": "Default",
    "releasedDate": "Released date",
    "imdbRating": "IMDB rating",
    "title": "Title",
};