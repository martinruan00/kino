import { AppConfig } from '../config/config.js';
import axios from 'axios';

class OmdbApiService {
    searchByType(searchString, movieType, year) {
        let request = `${AppConfig.server}/?apikey=${AppConfig.apikey}&s=${searchString}&type=${movieType}&y=${year}&r=json&page=1`;
        return axios.get(request);
    }

    searchById(id) {
        let request = `${AppConfig.server}/?apikey=${AppConfig.apikey}&i=${id}&plot=full`;
        return axios.get(request);
    }

    searchByName(movieName, y) {
        let request = `${AppConfig.server}/?apikey=${AppConfig.apikey}&t=${movieName}&y=${y}`;
        return axios.get(request);
    }
}

const omdbApiService = new OmdbApiService();
export default omdbApiService;