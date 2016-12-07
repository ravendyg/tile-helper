'use strict';

require('./app.less');

import { getOsmTile, getYaTile } from './tile';

// init map
var southWest = L.latLng(30, 10),
    northEast = L.latLng(80, 200),
    bounds = L.latLngBounds(southWest, northEast);
var mapParams =
{
  lat: 54.86587703802659,
  lng: 83.08142423629762,
  zoom: 16
};

var Map =
  L.map(
    'map',
    {
      minZoom: 4,
      maxBounds: bounds
    })
  .setView(mapParams, mapParams.zoom);

L.tileLayer['provider']('OpenStreetMap.Mapnik').addTo(Map);

var popup;

Map.on(
  'click',
  event =>
  {
    var latLng = event.latlng;
    var zoom = Map.getZoom();
    var osmTile = getOsmTile(latLng, zoom);
    var yaTile = getYaTile(latLng, zoom);

    console.log( osmTile, yaTile );

    popup =
      L.popup()
      .setLatLng(latLng)
      .setContent( getPopupContent(latLng, zoom, osmTile, yaTile) )
      .openOn(Map)
      ;
  }
);

function getPopupContent(latLng, zoom, osmTile, yaTile)
{
  var osmLink = `http://c.tile.openstreetmap.org/${zoom}/${osmTile.x}/${osmTile.y}.png`;
  var yaLink, yaText, trafficLink, trafficText
  if (zoom === 16)
  {
    yaLink = `https://vec04.maps.yandex.net/tiles?l=map&v=4.130.1&x=${yaTile.x}&y=${yaTile.y}&z=${zoom}&scale=1`;
    yaText = `<a href="${yaLink}" target="_blank">${yaLink}</a>`;
    trafficLink = `https://jgo.maps.yandex.net/1.1/tiles?trf&l=trf,trfe&lang=ru_RU&x=${yaTile.x}&y=${yaTile.y}&z=${zoom}&scale=1&tm=${unixNow()}`;
    trafficText = `<a href="${trafficLink}" target="_blank">${trafficLink}</a>`;
  }
  else
  {
    yaText = '<span>incorrect zoom (should be 16)</span>';
    trafficText = '<span>incorrect zoom (should be 16)</span>';
  }
  var out =
  `<h5>Coordinates:</h5>
  <p>lat: ${latLng.lat}</p>
  <p>lng: ${latLng.lng}</p>
  <p>zoom: ${zoom}</p>
  <h5>OSM tile</h5>
  <a href="${osmLink}" target="_blank">${osmLink}</a>
  <h5>Yandex tile</h5>
  ${yaText}
  <h5>OSM tile</h5>
  ${trafficText}
  `;

  return out;
}

function unixNow()
{
  return Math.round( Date.now() / 1000 );
}