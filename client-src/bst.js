'use strict';

function insertNode(node, key, val)
{
  var out;

  if ( node === null )
  {
    out = createNode(key, val, null, null);
  }
  else if (node.key > key )
  {
    out =
      createNode(node.key, node.val,
        insertNode(node.left, key, val), node.right
      );
  }
  else
  { // equality should be the case here
    out =
      createNode(node.key, node.val,
        node.left, insertNode(node.right, key, val)
      );
  }
}

function createNode(key, val, left, right)
{
  return {
    key,
    val,
    left,
    right
  };
}


export default {
  insertNode
};


function isEqual(key1, key2)
{
  return Math.abs(key1 - key2) < 0.00000000001;
}