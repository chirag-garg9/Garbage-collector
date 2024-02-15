import React, { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import {getCoordinate } from '../../utilities/Firebase'
import './style.css'
import { useNavigate,useParams } from 'react-router-dom';

export var map;
export default function MapComponent() {
   
  
    const [currentLocation, setCurrentLocation] = useState({ lat: 21.249442788089603,  lng: 81.60535924747276});
    const [locfromdb, setlocfromdb] = useState([]);
    const navigate=useNavigate();
    const potId = useParams();

    useEffect(() => {
        const getloca = async () => {
            const data = await getCoordinate();
            setlocfromdb(data);
            console.log(data);
        }
        getloca();
       
    }, [])
    
    
    function initializeMap() {
        mapboxgl.accessToken = 'pk.eyJ1IjoicmFqYXNnaDE4IiwiYSI6ImNsbDJsaXBxejAxanMzZHA4N2M3Y25nZnQifQ.tax8bLXV0ELmaMYH1PtevQ';
        map = new mapboxgl.Map({
            container: 'map', // container ID
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [currentLocation.lng, currentLocation.lat], // starting position [lng, lat]
            zoom: 13 // starting zoom
        });

        // const marker = new mapboxgl.Marker()
        //     .setLngLat([currentLocation.lng, currentLocation.lat])
        //     .addTo(map)

        // marker.getElement().addEventListener('click', function() {
        //         alert('Marker was clicked!');
        //         navigate(`/pothole/${1}`);
        //       });

        locfromdb.map((location) => {
            const marker = new mapboxgl.Marker({
                color: "#ff7e6b",
            })
            .setLngLat([ location.latitude,location.longitude,])
            .addTo(map)
            marker.getElement().addEventListener('click', function() {
                        alert('Marker was clicked!');
                        navigate(`/pothole/${location.id}`);
                      });
        })


        // locfromdb.map((location) => {
        //     new mapboxgl.Marker()
        //       .setLngLat([location.longi, location.lati])
        //       .addTo(map);
        //   });


        var fullscreenControl = new mapboxgl.FullscreenControl();
            map.addControl(fullscreenControl, 'top-right');

         map.addControl(
                new MapboxDirections({
                accessToken: mapboxgl.accessToken
                }),
                'top-left'
                );
    
    }

    
    // useEffect(() => {
    //     mapboxgl.accessToken = 'pk.eyJ1IjoicmFqYXNnaDE4IiwiYSI6ImNsbDJsaXBxejAxanMzZHA4N2M3Y25nZnQifQ.tax8bLXV0ELmaMYH1PtevQ';
    //     map = new mapboxgl.Map({
    //         container: 'map', // container ID
    //         // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    //         style: 'mapbox://styles/mapbox/streets-v12', // style URL
    //         center: [currentLocation.lng, currentLocation.lat], // starting position [lng, lat]
    //         zoom: 12 // starting zoom
    //     });
    //     // const marker = new mapboxgl.Marker()
    //     //     .setLngLat([currentLocation.lng, currentLocation.lat])
    //     //     .setPopup(new mapboxgl.Popup().setHTML('for more details click here'))
    //     //     .addTo(map)
    //     // locfromdb.map((location) => {
    //     //     const marker = new mapboxgl.Marker({
    //     //         color: "#ff7e6b",
    //     //     })
    //     //     .setLngLat([location.longi, location.lati])
    //     //     .addTo(map)
    //     // })
    //     locfromdb.map((location) => {
    //         new mapboxgl.Marker()
    //           .setLngLat([location.longi, location.lati])
    //           .addTo(map);
    //       });


    //     var fullscreenControl = new mapboxgl.FullscreenControl();
    //         map.addControl(fullscreenControl, 'top-right');
    //          // You can change the position as needed
       
 
    // }, [currentLocation]);

    // useEffect(() => {
    //     map.addControl(
    //         new MapboxDirections({
    //         accessToken: mapboxgl.accessToken
    //         }),
    //         'top-left'
    //         );

    //     // directions.setOrigin(21.249822174212973, 81.6050290955325); // Start location
    //     // directions.setDestination(21.257699896727612, 81.57949959595742); // End location

    // }, [])
    
   
    useEffect(() => {
      
        initializeMap();
      
    }, [])

    window.addEventListener('beforeunload',initializeMap );


    return (
        <div id='map' style={{height:'100vh',width:'100vw'}}>
           hlo this is map
        </div>
    )
}