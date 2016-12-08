'use strict';

// top left corner coords
const equator = 40075016.685578488;
const Rn = 6378137.0;

const ab = 0.00335655146887969400;
const bb = 0.00000657187271079536;
const cb = 0.00000001764564338702;
const db = 0.00000000005328478445;

var worldSize = zoom => Math.pow(2, zoom);

var a = zoom => worldSize(zoom) / equator;
var b = equator / 2;

var mercatorX = (tile, zoom) => tile.x / a(zoom) - b;
var mercatorY = (tile, zoom) => b - tile.y / a(zoom);

var xphi = (tile, zoom) =>
  Math.PI / 2 - 2 * Math.atan( 1 / Math.exp( mercatorY(tile, zoom) / Rn ) );
var xhpiR = (lat, zoom) =>{
  console.log(Math.tan((Math.Pi / 2 - lat) / 2) * Rn)
  return (b - Math.log(1 / (Math.tan((Math.Pi / 2 - lat) / 2) * Rn))) * a(zoom);
}

var latitude = (tile, zoom) =>
{
  let xp = xphi(tile, zoom);
  let out =
    xp +
    ab * Math.sin(2 * xp) +
    bb * Math.sin(4 * xp) +
    cb * Math.sin(6 * xp) +
    db * Math.sin(8 * xp)
    ;

  return out * 180 / Math.PI;
}

var longitude = (tile, zoom) => mercatorX(tile, zoom) * 180 / Math.PI / Rn;


var tile = {x: 11973, y: 5207};
var zoom = 14;

// console.log(
//   latitude(tile, zoom),
//   longitude(tile, zoom)
// );

// tile by coords yandex
const yaTile = (lat, lng, zoom) =>
{
  let xp = lat +
        ab * Math.asin(2 * lat) +
        bb * Math.asin(4 * lat) +
        cb * Math.asin(6 * lat) +
        db * Math.asin(8 * lat);
  return {
    x: (lng * Rn * Math.PI / 180 + b) * a(zoom),
    y: n(zoom) * (1 - Math.log( Math.tan( toRad(xp) ) + 1 / Math.cos(toRad(xp)) ) / Math.PI) / 2

  };
};

// tile by coords OSM

var n = (zoom) => Math.pow(2, zoom);
var toDeg = coord => coord / Math.PI * 180;
var toRad = coord => coord / 180 * Math.PI;

var osmTile = (lat, lng, zoom) =>
{
  console.log(zoom, n(zoom));
  console.log(((lng + 180) / 360));

  return {
    x: n(zoom) * ((lng + 180) / 360),
    y: n(zoom) * (1 - Math.log( Math.tan( toRad(lat) ) + 1 / Math.cos(toRad(lat)) ) / Math.PI) / 2
  };
}


// coords by OSM tile
var osmCoords = (x, y, zoom) =>
  ({
    lng: x / n(zoom) * 360 - 180,
    lat: Math.atan( Math.sinh(Math.PI * ( 1 - 2 * y / n(zoom)) ) ) * 180 / Math.PI
  });

console.log(tile);
console.log( 'ya coords', latitude(tile, zoom), longitude(tile, zoom));
console.log( 'ya tile from coords', yaTile(latitude(tile, zoom), longitude(tile, zoom), zoom));
// console.log( latitude(tile, zoom), longitude(tile, zoom));
console.log( 'osm tile from coords', osmTile(54.86648212112624, 83.08193922042847, zoom));
console.log( 'osm coords', osmCoords(tile.x, tile.y, zoom));
// console.log( yaTile(latitude(tile, zoom), longitude(tile, zoom), zoom));


// function yaToPixel(lat, lng)
// {
//   let rLat = lat * Math.PI / 180;
//   lat = Math.log( Math.tan(Math.PI/4+rLat/2)*((1-Math.exp(Math.sin(rLat))/(1+Math.exp(sin(rLat) * 2)))));


//   return {lng, lat};
// }

// console.log('last', yaToPixel(54.86772507245612, 83.07861328125003));