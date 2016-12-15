'use strict';

require('./app.less');

import { getOsmTile } from '../common/tile';
import { findYaTile, longitude, latitude } from '../common/ya';

import * as request from 'superagent';

var tileSize = 256; // tile size in pixels

const colors = ['#E53935', '#4A148C', '#880E4F', '#1565C0', '#B388FF', '#0277BD', '#004D40', '#827717', '#5D4037'];
var colorIndex = 0;

// init map
var southWest = L.latLng(30, 10),
    northEast = L.latLng(80, 200),
    bounds = L.latLngBounds(southWest, northEast);
var mapParams = JSON.parse(localStorage.getItem('map-state')) ||
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
    var yaTile = findYaTile(latLng, zoom);

    popup =
      L.popup()
      .setLatLng(latLng)
      .setContent( getPopupContent(latLng, zoom, osmTile, yaTile) )
      .openOn(Map)
      ;
  }
);

Map.on(
  'moveend',
  () =>
  {
    var c = Map.getCenter();
    localStorage.setItem('map-state', JSON.stringify({lat: c.lat, lng: c.lng, zoom: Map.getZoom()}));
  }
);

Map.on(
  'zomeend',
  () =>
  {
    var c = Map.getCenter();
    localStorage.setItem('map-state', JSON.stringify({lat: c.lat, lng: c.lng, zoom: Map.getZoom()}));
  }
);

function getPopupContent(latLng, zoom, osmTile, yaTile)
{
  var osmLink = `http://c.tile.openstreetmap.org/${zoom}/${osmTile.x}/${osmTile.y}.png`;
  var yaLink, yaText, trafficLink, trafficText, jsonLink, jsonText;

  yaLink = `https://vec04.maps.yandex.net/tiles?l=map&v=4.130.1&x=${yaTile.x}&y=${yaTile.y}&z=${zoom}&scale=1`;
  yaText = `<a href="${yaLink}" target="_blank">${yaLink}</a>`;
  trafficLink = `https://jgo.maps.yandex.net/1.1/tiles?trf&l=trf,trfe&lang=ru_RU&x=${yaTile.x}&y=${yaTile.y}&z=${zoom}&scale=1&tm=${unixNow()}`;
  trafficText = `<a href="${trafficLink}" target="_blank">${trafficLink}</a>`;
  jsonLink = `https://jgo.maps.yandex.net/1.1/tiles?trf&l=trj,trje&lang=ru_RU&x=${yaTile.x}&y=${yaTile.y}&z=${zoom}&scale=1&tm=${unixNow()}`;
  jsonText = `<a href="${jsonLink}" target="_blank">${jsonLink}</a>`;

  var out =
  `<h5>Coordinates:</h5>
  <p>lat: ${latLng.lat}</p>
  <p>lng: ${latLng.lng}</p>
  <p>zoom: ${zoom}</p>
  <h5>OSM tile</h5>
  <a href="${osmLink}" target="_blank">${osmLink}</a>
  <h5>Yandex tile</h5>
  ${yaText}
  <h5>Traffic tile</h5>
  ${trafficText}
  <h5>Traffic json</h5>
  ${jsonText}
  `;

  fetchTraffic(jsonLink, yaTile, zoom);

  return out;
}

function unixNow()
{
  return Math.round( Date.now() / 1000 );
}

var stamp = 0;

function fetchTraffic(link, tile, zoom)
{
  request
  .get(link)
  .end(
    (err, res) =>
    {
      var features;
      var tLat = latitude(tile, zoom);  // top left corner
      var tLng = longitude(tile, zoom);
      var nextTile =
      {
        x: tile.x + 1,
        y: tile.y + 1
      };
      var bLat = latitude(nextTile, zoom);  // bottom right corner
      var bLng = longitude(nextTile, zoom);

      var yCoef = (tLat - bLat) / tileSize;
      var xCoef = (tLng - bLng) / tileSize;


      try
      {
        var temp = JSON.parse(res.text).data.features;
        features =
          // remove accidents
          (temp.length > 0 && temp[0].type === 'FeatureCollection' && temp[0].features ? temp[0].features : temp)
          .map(
            e =>
            ({
              coordinates: e.properties.HotspotMetaData.RenderedGeometry.coordinates,
              speed: e.properties.description,
              id: `${tile.x}|${tile.y}|${e.properties.HotspotMetaData.id}`
            })
          );

          var mk;
          L.marker([tLat, tLng]).addTo(Map);
          L.marker([bLat, bLng]).addTo(Map);


        // console.log(
        //   transformCoords(features[0].coordinates, yCoef, xCoef, tLat, tLng).map(e => e[0])
        // );

        var poly;
        for (var i = 0; i < features.length; i++)
        {
          for (var frame of features[i].coordinates)
          {
            poly = L.polygon( transformCoords([frame], yCoef, xCoef, tLat, tLng).map(e => e[0]),
              {color: colors[colorIndex]} );
            colorIndex = (++colorIndex) % colors.length;
            (function(val, frame){
              poly.on(
                'mouseover',
                () =>
                {
                  console.log(val, frame);
                }
              );
            })(features[i].id + ' ' + features[i].speed, frame[0]);
            poly.addTo(Map);
          }
        }


      }
      catch (err)
      {
        console.error(err);
      }
    }
  );
}

function transformCoords(coords, yC, xC, tLat, tLng)
{
  var out = [];
  var temp;

  for (var item of coords)
  {
    if (Array.isArray(item) && Array.isArray(item[0]) )
    {
      out.push( transformCoords(item, yC, xC, tLat, tLng) )
    }
    else
    {
      temp = [];
      temp.push( tLat - yC * item[1] );
      temp.push( tLng - xC * item[0] );
      out.push(temp);
    }
  }

  return out;
}