import { writable } from 'svelte/store';

const createIssStore = () => {
    const { subscribe, set } = writable({
        longitude: 0,
        latitude: 0,
    });

    const fetchIssPosition = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_ISS_PROXY}http:/api.open-notify.org/iss-now.json`);
            const data = await response.json();
            const { longitude, latitude } = data.iss_position;
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
