import React from 'react';
import omdbApiService from '../../services/OmdbApiService.js';

export class MovieDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null
        };
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        omdbApiService.searchById(this.props.match.params.id)
            .then(resp => {
                this.setState({ movie: resp.data });
            });
    }

    render() {
        if (!this.state.movie)
            return (null);
        return (
            <div className="row">
                <h1 className="col-12">{this.state.movie.Title}</h1>
                <div className="col-2">
                    <img className="movie-poster" src={this.state.movie.Poster} />
                </div>
                <div className="col-10">
                    <div className="float-left">
                        
                        <div>Released date: {this.state.movie.Released}</div>
                        <div>Actors: {this.state.movie.Actors}</div>
                        <div>Plot: {this.state.movie.Plot}</div>
                    </div>
                </div>
            </div>
            );
    }
}