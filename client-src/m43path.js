// prototype model of bus path
'use strict';

/*
  Point:
  {
    lat: float,
    lng: float
  }

  Feature:
  {
    x: int,                // contining tile x
    y: int,
    id: int
  }

  Path:
  {
    [direction: string]:        // 'A' or 'B'
    {
      [id: string]:             // autoincrement index, starts with 0 wjich represent a point not a segment
      {
        end: Point,
        feature?: Feature,      // if missing - couldn't find corresponding feature in Yandex data
        defaultSpeed: int,
        dist: float             // km
        stopId?: int            // stop that is situated at the end of the segment (can be rounded for small segments)
      }
    }
  }
*/

// до Бердышева / Смежная

const self =
{
  A:
  {
    '0':
    {
      end:
      {
        lat: 54.86949505279727,
        lng: 82.9420566558838
      },
    },
    '1':
    {
      end:
      {
        lat: 54.86862453624381,
        lng: 82.94724941253662
      },
      feature:
      {
        x: 23933,
        y: 10413,
        id: 191668
      },
      defaultSpeed: 60,
      dist: 0.354
    },
    '2':
    {
      end:
      {
        lat: 54.868038007399626,
        lng: 82.94986724853517
      },
      feature:
      {
        x: 23934,
        y: 10413,
        id: 178195
      },
      defaultSpeed: 60,
      dist: 0.176
    },
    '3':
    {
      end:
      {
        lat: 54.86742059939764,
        lng: 82.94952392578126
      },
      defaultSpeed: 40,
      dist: 0.073,
      stopId: 1584
    },
    '4':
    {
      end:
      {
        lat: 54.86618575502839,
        lng: 82.95591831207277
      },
      feature:
      {
        x: 23934,
        y: 10414,
        id: 143939
      },
      defaultSpeed: 60,
      dist: 0.440,
      stopId: 1581
    }
  },

  B:
  {
    '':
    {
      end:
      {
        lat: 54.86742059939764,
        lng: 82.94952392578126
      },
      feature:
      {
        x: 23934,
        y: 10414,
        id: 132771
      },
      defaultSpeed: 60,
      dist: 0.440,
      stopId: 1583
    },
    '':
    {
      end:
      {
        lat: 54.868038007399626,
        lng: 82.94986724853517
      },
      defaultSpeed: 40,
      dist: 0.073
    },
    '':
    {
      end:
      {
        lat: 54.86862453624381,
        lng: 82.94724941253662
      },
      feature:
      {
        x: 23934,
        y: 10413,
        id: 182384
      },
      defaultSpeed: 60,
      dist: 0.176
    },
    '':
    {
      end:
      {
        lat: 54.86949505279727,
        lng: 82.9420566558838
      },
      feature:
      {
        x: 23933,
        y: 10413,
        id: 145235
      },
      defaultSpeed: 60,
      dist: 0.354
    }
  }
}