import { writable } from 'svelte/store';

const createIssStore = () => {
    const { subscribe, set } = writable({
        longitude: 0,
        latitude: 0,
    });

    const fetchIssPosition = async () => {
        try {
            const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
            const data = await response.json();
            const { longitude, latitude } = data;
            set({ longitude, latitude });
        } catch (error) {
            console.error('Error fetching ISS position:', error);
        }
    };

    return {
        subscribe,
        fetchIssPosition,
    };
};

export const issStore = createIssStore();
