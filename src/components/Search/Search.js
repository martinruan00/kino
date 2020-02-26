import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import omdbApiService from '../../services/OmdbApiService.js';
import movieTypes from '../../services/MovieTypes.js';
import './Search.css';
import { Redirect } from 'react-router-dom'

export class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = { resultList: [], movieName: "", toSearchResult: false, toMovieDetail: false };

        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.onSearchResultSelected = this.onSearchResultSelected.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div className="row col-12 justify-content-center">
                {this.redirectToSearchResult()}
                <input type="text" onKeyPress={this.onKeyPress} value={this.state.movieName} onChange={this.handleChange} />
            </div>
        );
    }

    handleChange(event) {
        if (this.state.toSearchResult) {
            this.setState({ toSearchResult: false });
        }
        this.setState({ movieName: event.target.value });
    }

    onSearchTextChanged(event, values) {
        event.preventDefault();

        omdbApiService.searchByType(event.target.value, movieTypes.movie)
            .then(res => {
                this.setState({ resultList: res.data.Response == "False" ? [] : res.data.Search });
            })
            .catch(e => {
                console.log(e);
            });
    }

    onSearchResultSelected(event, values) {
        //if (values) {
        //    this.setState({ toMovieDetail: true });
        //}
    }

    onKeyPress(event) {
        if (event.key == "Enter") {
            this.setState({ toSearchResult: true });
        }
    }

    redirectToMovieDetail() {
        if (this.state.toMovieDetail) {
            return <Redirect to={{ pathname: "/movie-detail", state: { movie: this.state.movieName } }} />
        }
    }
    redirectToSearchResult() {
        if (this.state.toSearchResult) {
            return <Redirect to={{ pathname: "/search-result", state: { movie: this.state.movieName } }} />
        }
    }
}