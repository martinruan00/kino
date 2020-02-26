import React from 'react';
import omdbApiService from '../../services/OmdbApiService.js';
import movieTypes from '../../services/MovieTypes.js';
import './SearchResult.css';
import { MoviePreview } from '../MoviePreview/MoviePreview.js';

export class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: []
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    componentDidMount() {
        this.doSearch();
    }
    componentDidUpdate() {
        this.doSearch();
    }

    doSearch() {
        if (this.lastSearchValue == this.props.location.state.movie) {
            return;
        }
        this.lastSearchValue = this.props.location.state.movie;
        omdbApiService.searchByType(this.lastSearchValue, movieTypes.movie)
            .then(res => {
                let movieIDs = res.data.Response == "False" ? [] : res.data.Search.map(s => s.imdbID);
                Promise.all(movieIDs.map(id => omdbApiService.searchById(id)))
                    .then(response => {
                        this.setState({ movies: response.map(r => r.data) });
                    });
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        return (
            <>
                <h1>Search result for "{this.props.location.state.movie}"</h1>
                {this.state.movies.map(m => (<MoviePreview movie={m} />))}
            </>
        );
    }
}