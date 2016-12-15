'use strict';

/**
 * get current time in seconds
 */
function nowSec ()
{
  return Math.round( Date.now() / 1000 );
}
module.exports.nowSec = nowSec;