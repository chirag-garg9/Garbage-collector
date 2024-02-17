import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

export default function MapComponent() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 21.249442788089603,
    lng: 81.60535924747276,
  });

  const [locationsFromBackend, setLocationsFromBackend] = useState([]);
  const [journeyLocations, setJourneyLocations] = useState([]);
  const [customMarkerLoaded, setCustomMarkerLoaded] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFqYXNnaDE4IiwiYSI6ImNsbDJsaXBxejAxanMzZHA4N2M3Y25nZnQifQ.tax8bLXV0ELmaMYH1PtevQ';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [currentLocation.lng, currentLocation.lat],
      zoom: 13,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    });

    map.addControl(directions, 'top-left');

    // Add marker for the initial location
    const marker = new mapboxgl.Marker().setLngLat([currentLocation.lng, currentLocation.lat]).addTo(map);

    const fetchLocationsFromBackend = async () => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      try {
        const response = await fetch('http://localhost:4000/locations', {
          method: 'GET',
        });
        const data = await response.json();
    
        // Adding a 5-second delay
        setLocationsFromBackend(data);
      } catch (error) {
        console.error('Error fetching locations from backend:', error.message);
      }
      setTimeout(() => {
        addMarkersForLocations();
      }, 1);
    };
    
    

    const addMarkersForLocations = () => {
      locationsFromBackend.forEach((locationString) => {
        const [longitude, latitude] = locationString.split(',').map(parseFloat);

        // Add a marker for each location
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);
      });
    };

    fetchLocationsFromBackend();
    addMarkersForLocations();

    const watchUserLocation = () => {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Update marker position
          marker.setLngLat([longitude, latitude]);

          // Center the map on the user's location
          map.flyTo({
            center: [longitude, latitude],
            essential: true,
          });
        },
        (error) => {
          console.error('Error watching user location:', error.message);
        }
      );
    };

    watchUserLocation();

    // Load a custom marker image
    map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      (error, image) => {
        if (error) {
          console.error('Error loading custom marker image:', error.message);
        } else {
          map.addImage('custom-marker', image);
          setCustomMarkerLoaded(true);
        }
      }
    );

    return () => {
      // Cleanup when the component unmounts
      map.remove();
    };
  }, [locationsFromBackend, currentLocation]);

  const handleStartButtonClick = async () => {
    // Assuming the end location is a constant value (adjust as needed)
    const endLocation = { lat: 22.0, lng: 82.0 }; // Update with your actual end location

    try {
      // Send a request to calculate the path
      const response = await fetch('http://localhost:4000/calculate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startLocation: currentLocation,
          endLocation: endLocation,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setJourneyLocations(data);

        // Update the map to display the journey locations
        updateMapWithJourney(data);
      } else {
        console.error('Error calculating path:', response.statusText);
      }
    } catch (error) {
      console.error('Error calculating path:', error.message);
    }
  };

  const updateMapWithJourney = (journeyLocations) => {
    // Clear existing markers
    map.removeLayer('journeyMarkers');
    map.removeSource('journeyMarkers');

    // Create a new source and add markers for the journey locations
    map.addSource('journeyMarkers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: journeyLocations.map((location) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
          },
          properties: {
            title: 'Journey Location',
          },
        })),
      },
    });

    // Add a layer for the journey markers
    map.addLayer({
      id: 'journeyMarkers',
      type: 'symbol',
      source: 'journeyMarkers',
      layout: {
        'icon-image': 'custom-marker',
        'icon-allow-overlap': true,
      },
    });
  };

  return (
    <div style={{ position: 'relative', height: '93vh', width: '100vw', margin: 'auto' }}>
      <div id='map' style={{ height: '100%', width: '100%' }} />
      {customMarkerLoaded && (
        <button
          onClick={handleStartButtonClick}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: '#00688B', // Dark blue color
            borderRadius: '50%', // circular edges
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Start
        </button>
      )}
    </div>
  );
}
