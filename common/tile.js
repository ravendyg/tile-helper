'use strict';

var n = (zoom) => Math.pow(2, zoom);
var toDeg = coord => coord / Math.PI * 180;
var toRad = coord => coord / 180 * Math.PI;

export
function getOsmTile({lat, lng}, zoom)
{
  return {
    x: Math.floor( n(zoom) * ((lng + 180) / 360) ),
    y: Math.floor(
      n(zoom) * (1 - Math.log( Math.tan( toRad(lat) ) + 1 / Math.cos(toRad(lat)) ) / Math.PI) / 2
    )
  };
}
