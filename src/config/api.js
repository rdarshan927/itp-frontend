/**
 * Licensed under the Shepora Flower Plant Management System License (v1.0)
 * See the LICENSE.txt file for more details.
 */

import axios from 'axios';

const FLOWER_API_URL = process.env.REACT_APP_FLOWER_API_URL;
const WEATHER_API_URL = process.env.REACT_APP_WEATHER_API_URL;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const api = axios.create({
    baseURL: FLOWER_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const uploadFile = (url, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const weatherapi = axios.create({
    baseURL: WEATHER_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    params: {
        key: WEATHER_API_KEY
    }
});

export { api, weatherapi, uploadFile };
