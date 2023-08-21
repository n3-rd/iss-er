<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { issStore } from "$lib/stores.js"; // Update the import path based on your project structure

    let mapElement;
    let map;

    let position = {};
    let issMarker; // Declare a variable to hold the ISS marker

    // Subscribe to changes in the issStore
    issStore.subscribe((value) => {
        position = value;
    });

    issStore.fetchIssPosition();

    // Fetch ISS position when the component is mounted
    setInterval(() => {
        issStore.fetchIssPosition();
    }, 5000); // Update the position every 5 seconds

    onMount(async () => {
        if (browser) {
            const leaflet = await import("leaflet");

            map = leaflet
                .map(mapElement)
                .setView([position.latitude, position.longitude], 5);

            L.tileLayer(
                `https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=${
                    import.meta.env.VITE_JAWG_ACCESS_TOKEN
                }`,
                {
                    attribution:
                        '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    minZoom: 0,
                    maxZoom: 22,
                    subdomains: "abcd",
                    accessToken: import.meta.env.VITE_JAWG_ACCESS_TOKEN,
                }
            ).addTo(map);
            var issIcon = L.icon({
                iconUrl: "/iss.png",
                iconSize: [77, 77],
                iconAnchor: [22, 94],
            });

            // Initialize the ISS marker
            issMarker = leaflet
                .marker([position.latitude, position.longitude], {
                    icon: issIcon,
                })
                .addTo(map);

            // Update marker position and view to ISS position every 5 seconds
            setInterval(() => {
                issStore.fetchIssPosition();
                // Remove the existing marker
                issMarker.remove();

                var issIcon = L.icon({
                    iconUrl: "/iss.png",
                    iconSize: [77, 77],
                    iconAnchor: [22, 94],
                });
                // Create a new marker with the updated position
                issMarker = leaflet
                    .marker([position.latitude, position.longitude], {
                        icon: issIcon,
                    })
                    .addTo(map);

                // pan the map view to the new position
                map.panTo([position.latitude, position.longitude]);
            }, 5000);
        }
    });

    onDestroy(async () => {
        if (map) {
            console.log("Unloading Leaflet map.");
            map.remove();
            unsubscribe(); // Unsubscribe from the store when the component is destroyed
        }
    });
</script>

<main>
    <div bind:this={mapElement} />
</main>

<style>
    @import "leaflet/dist/leaflet.css";
    main div {
        height: 800px;
    }
</style>
