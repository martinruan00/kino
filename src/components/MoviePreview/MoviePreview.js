import React from 'react';
import './MoviePreview.css';
import { Link } from 'react-router-dom';

export class MoviePreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToDetail: false
        };
    }

    render() {
        const m = this.props.movie;
        return (
            <div className="row mt-2" key={m.imdbID}>
                <div className="col-2">
                    <img className="movie-poster" src={m.Poster} />
                </div>
                <div className="col-10">
                    <div>
                        <Link to={`/movie-detail/${m.imdbID}`}>{m.Title}</Link>
                    </div>
                    <div>Genre: {m.Genre}</div>
                    <div>Released date: {m.Released}</div>
                    <div className="row">
                        {m.Ratings.map(r => (
                            <div className="col-3" key={r.Source}>
                                <div className="rating d-inline-block">
                                    <div className="source">{r.Source}</div>
                                    <div className="value">{r.Value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}