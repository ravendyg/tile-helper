// 'use strict';

// should switch to tor proxy asap
const request = require('request');

const utils = require('./utils');

const ya = require('../common/ya');

let m43A = require('../bus-info/m43path').A;

let zoom = 15;    // hardcoded, decide later

let tiles = new Map();

// later use sequential promises or smth else to run many requests in limited time frame
// but without massive outburst
let timeout = 0;

// populate map with all tiles that would be required
for (let key of Object.keys(m43A) )
{
  if (m43A[key].tile)
  {
    let tileKey = m43A[key].tile.x + '|' + m43A[key].tile.y + '|' + zoom;
    if (!tiles.has(tileKey))
    {
      tiles.set(
        tileKey,
        {
          tsp: 0,
          features: new Map()
        }
      );
    }
  }
}


function fetchTraffic(val, key, map)
{
  let tsp = utils.nowSec();
  let [x, y, zoom] = key.split('|');
  console.log(`https://jgo.maps.yandex.net/1.1/tiles?trf&l=trj,trje&lang=ru_RU&x=${x}&y=${y}&z=${zoom}&scale=1&tm=${tsp}`);
  request(
    {
      url: `https://jgo.maps.yandex.net/1.1/tiles?trf&l=trj,trje&lang=ru_RU&x=${x}&y=${y}&z=${zoom}&scale=1&tm=${tsp}`,
      method: 'GET'
    },
    (err, httpResp, body) =>
    {
      if (err)
      {
        console.error(err.stack);
      }
      else if (httpResp.statusCode !== 200)
      {
        console.error(httpResp.statusMessage, body);
      }
      else
      {
        let features = ya.extractTrafficPolygons({x, y}, body);
        for (let q of features)
        {
          let speed = q.speed,
              coordinates = q.coordinates;
          let features = new Map();

          for (let poly of coordinates)
          {
            features.set(poly, speed);
          }

          map.set(key, {tsp, features});
        }

        console.log(map);

      }
    }
  );
}



module.exports.startWatching =
function startWatching()
{
  // populate tiles map
  tiles.forEach(
    (val, key, map) =>
    {
      setTimeout(fetchTraffic, timeout, val, key, map);
      timeout += 100;
    }
  );
}