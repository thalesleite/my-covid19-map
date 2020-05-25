import { useEffect, useState } from 'react';
import axios from 'axios';

const API_HOST = 'https://corona.lmao.ninja/v2';
const ENDPOINTS = [
    {
        id: 'all',
        path: '/all',
        isDefault: true
    },
    {
        id: 'countries',
        path: '/countries'
    }
];

const defaultState = {
    data: null,
    state: 'ready'
}

const useTracker = ({ api = 'all' }) => {
    const [tracker = {}, updateTracker] = useState(defaultState);

    async function fetchTracker() {
        let route = ENDPOINTS.find(({ id } = {}) => id === api);
        let resp;

        if ( !route ) {
            route = ENDPOINTS.find(({ isDefault } = {}) => !!isDefault);
        }

        try {
            updateTracker((prev) => {
                return {
                    ...prev,
                    state: 'loading'
                }
            });
            resp = await axios.get(`${API_HOST}${route.path}`);
        } catch(error) {
            updateTracker((prev) => {
                return {
                  ...prev,
                  state: 'error',
                  error: error
                }
            });
            return;
        }

        const { data } = resp;

        updateTracker((prev) => {
            return {
              ...prev,
              state: 'ready',
              data
            }
        });
    }

    useEffect(() => { fetchTracker() }, [api]);
    
    return {
        fetchTracker,
        ...tracker
    }
}

export default useTracker;