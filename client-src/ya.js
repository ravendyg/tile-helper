'use strict';

// top left corner coords
const equator = 40075016.685578488;
const b = equator / 2;
const Rn = 6378137.0;

const ab = 0.00335655146887969400;
const bb = 0.00000657187271079536;
const cb = 0.00000001764564338702;
const db = 0.00000000005328478445;

function worldSize(zoom)
{
  return Math.pow(2, zoom);
}

function a(zoom)
{
  return worldSize(zoom) / equator;
}


function mercatorX(tile, zoom)
{
  return tile.x / a(zoom) - b;
}
function mercatorY(tile, zoom)
{
  return b - tile.y / a(zoom);
}

function xphi(tile, zoom)
{
  return Math.PI / 2 - 2 * Math.atan( 1 / Math.exp( mercatorY(tile, zoom) / Rn ) );
}

// export
function latitude(tile, zoom)
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

// export
function longitude(tile, zoom)
{
  return mercatorX(tile, zoom) * 180 / Math.PI / Rn;
}


/**
 * find yandex tile numbers
 */
export
function findTile(lat, lng, zoom)
{
  var x = Math.floor( (lng * Rn * Math.PI / 180 + b) / equator * worldSize(zoom) );
  var y;
  // use base tile and =/- limit tiles (if lat is inside some range - for Novosibirsk, set limit tiles to those around Nsk, else use 0 and max)

  // 47892 is a base tile for zoom 16
  // var yTile = 47892 / Math.pow(2, 16-zoom);
  var yLat, yTile;
  var topTile = 323 / Math.pow(2, 10 - zoom),
      bottomTile = 327 / Math.pow(2, 10 - zoom);

  var topLat = latitude({y: topTile, x}, zoom);
  var bottomLat = latitude({y: bottomTile, x}, zoom);

  if (topLat < lat) topTile = 1;
  if (bottomLat > lat) bottomTile = 770 / Math.pow(2, 10 - zoom);

  var count = 0;

  while (true)
  {
    if (topTile === bottomTile)
    {
      yTile = bottomTile;
      break;
    }

    yTile = Math.floor( (topTile + bottomTile) / 2 );
    yLat = latitude({y: yTile, x}, zoom);

    if ( yLat > lat)
    {
      topTile = yTile;
      // topLat = yLat;
    }
    else
    {
      bottomTile = yTile;
      bottomLat = yLat;
    }

    if (topTile + 1 === bottomTile)
    { // converged
      yTile = lat > bottomLat ? topTile : bottomTile;
      break;
    }

    if (++count > 100) break;
  }


  return { x, y: yTile };
}


// var lat = 54.86676613659249;
// var lng = 83.0816173553467;
// var zoom = 16;

//   console.log( findTile(lat, lng, zoom));