'use strict';

require('./app.less');

// init map
var southWest = L.latLng(30, 10),
    northEast = L.latLng(80, 200),
    bounds = L.latLngBounds(southWest, northEast);
var mapParams = {"lat": 54.908593335436926, "lng": 83.0291748046875, "zoom": 16};
var Map =
  L.map(
    'map',
    {
      minZoom: 4,
      maxBounds: bounds
    })
  .setView(mapParams, mapParams.zoom);

L.tileLayer['provider']('OpenStreetMap.Mapnik').addTo(Map);