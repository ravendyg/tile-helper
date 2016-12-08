'use strict';

import * as Bst from './bst';
import { findTile } from './ya';

console.log('test online');


var lat = 54.86676613659249;
var lat2 = 54.867989;
var lng = 83.0816173553467;
var zoom = 16;

console.log( findTile(lat, lng, zoom), lat);
console.log( findTile(lat2, lng, zoom), lat2);