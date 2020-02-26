import React from 'react';
import './UpcomingMovies.css';
import axios from 'axios';
import omdbApiService from '../../services/OmdbApiService.js';
import { MoviePreview } from '../MoviePreview/MoviePreview.js';

export class UpcomingMovies extends React.Component {
    constructor(props) {
        super(props);
        this.state = { movies: [] };
    }

    componentDidMount() {
        let alphabets = 'qwertyuiopasdfghjklzxcvbnm1234567890'.split('');
        let moviePromises = alphabets.map(m => omdbApiService.searchByName(m, new Date().getFullYear()));
        Promise.all(moviePromises)
            .then(responses => {
                const result = [];
                const map = new Map();
                for (let data of responses.filter(r => r.data.Response != 'False' && r.data.Poster != 'N/A').map(r => r.data)) {
                    if (!map.has(data.imdbID)) {
                        map.set(data.imdbID, true);
                        result.push(data);
                    }
                }
                this.setState({ movies: result });
            });

    }

    render() {
        let header = this.state.movies.length > 0 ? 'Upcoming movies' : '';
        return (
            <>
                <h1>{header}</h1>
                {this.state.movies.map(m => (<MoviePreview movie={m} key={m.imdbID} />))}
            </>
        );
    }
}