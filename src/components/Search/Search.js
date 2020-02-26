import React from 'react';
import omdbApiService from '../../services/OmdbApiService.js';
import movieTypes from '../../services/MovieTypes.js';
import './Search.css';

export class Search extends React.Component {
    constructor(props) {
        super(props);

        let types = {};
        movieTypes.forEach(t => types[t] = true);
        this.state = Object.assign(types, { resultList: [], movieName: "", toSearchResult: false, toMovieDetail: false });
    }

    render() {
        return (
            <div className="row col-12 justify-content-center">
                {this.redirectToSearchResult()}
                <form className="form-inline">
                    <div className="input-group">
                        {movieTypes.map(t => (
                            <div className="form-check form-check-inline" key={t}>
                                <input className="form-check-input" type="checkbox" value={t} checked={this.state[t]} onChange={this.onMovieTypeCheckChanged.bind(this)} id={t} />
                                <label className="form-check-label" htmlFor={t}>{t}</label>
                            </div>
                        ))}
                    </div>
                    <div className="input-group">
                        <input className="form-control" placeholder="Movie name" type="text" onKeyPress={this.onKeyPress.bind(this)} value={this.state.movieName} onChange={this.handleChange.bind(this)} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={e => this.setState({ toSearchResult: true })}>Search</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    onMovieTypeCheckChanged(event) {
        this.state[event.target.value] = event.target.checked;
        this.setState(this.state);
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

    onKeyPress(event) {
        if (event.key == "Enter") {
            this.setState({ toSearchResult: true });
        }
    }

    redirectToSearchResult() {
        if (this.state.toSearchResult) {
            this.props.history.push(`/search-result/${this.state.movieName}&${movieTypes.filter(t => this.state[t]).join(',')}`);
        }
    }
}