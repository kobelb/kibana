/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { UptimeFetchDataResponse, FetchData } from '../../../typings';

export const fetchUptimeData: FetchData<UptimeFetchDataResponse> = () => {
  return Promise.resolve(response);
};

const response: UptimeFetchDataResponse = {
  appLink: '/app/uptime#/',
  stats: {
    monitors: {
      type: 'number',
      value: 26,
    },
    up: {
      type: 'number',
      value: 20,
    },
    down: {
      type: 'number',
      value: 6,
    },
  },
  series: {
    up: {
      coordinates: [
        {
          x: 1593295200000,
          y: 1170,
        },
        {
          x: 1593297000000,
          y: 1170,
        },
        {
          x: 1593298800000,
          y: 1170,
        },
        {
          x: 1593300600000,
          y: 1170,
        },
        {
          x: 1593302400000,
          y: 1170,
        },
        {
          x: 1593304200000,
          y: 1170,
        },
        {
          x: 1593306000000,
          y: 1170,
        },
        {
          x: 1593307800000,
          y: 1170,
        },
        {
          x: 1593309600000,
          y: 1170,
        },
        {
          x: 1593311400000,
          y: 1170,
        },
        {
          x: 1593313200000,
          y: 1170,
        },
        {
          x: 1593315000000,
          y: 1170,
        },
        {
          x: 1593316800000,
          y: 1170,
        },
        {
          x: 1593318600000,
          y: 1170,
        },
        {
          x: 1593320400000,
          y: 1170,
        },
        {
          x: 1593322200000,
          y: 1170,
        },
        {
          x: 1593324000000,
          y: 1170,
        },
        {
          x: 1593325800000,
          y: 1170,
        },
        {
          x: 1593327600000,
          y: 1170,
        },
        {
          x: 1593329400000,
          y: 1170,
        },
        {
          x: 1593331200000,
          y: 1170,
        },
        {
          x: 1593333000000,
          y: 1170,
        },
        {
          x: 1593334800000,
          y: 1170,
        },
        {
          x: 1593336600000,
          y: 1170,
        },
        {
          x: 1593338400000,
          y: 1170,
        },
        {
          x: 1593340200000,
          y: 1170,
        },
        {
          x: 1593342000000,
          y: 1170,
        },
        {
          x: 1593343800000,
          y: 1170,
        },
        {
          x: 1593345600000,
          y: 1170,
        },
        {
          x: 1593347400000,
          y: 1170,
        },
        {
          x: 1593349200000,
          y: 1170,
        },
        {
          x: 1593351000000,
          y: 1170,
        },
        {
          x: 1593352800000,
          y: 1170,
        },
        {
          x: 1593354600000,
          y: 1170,
        },
        {
          x: 1593356400000,
          y: 1170,
        },
        {
          x: 1593358200000,
          y: 1170,
        },
        {
          x: 1593360000000,
          y: 1170,
        },
        {
          x: 1593361800000,
          y: 1170,
        },
        {
          x: 1593363600000,
          y: 1170,
        },
        {
          x: 1593365400000,
          y: 1170,
        },
        {
          x: 1593367200000,
          y: 1170,
        },
        {
          x: 1593369000000,
          y: 1170,
        },
        {
          x: 1593370800000,
          y: 1170,
        },
        {
          x: 1593372600000,
          y: 1170,
        },
        {
          x: 1593374400000,
          y: 1169,
        },
        {
          x: 1593376200000,
          y: 1170,
        },
        {
          x: 1593378000000,
          y: 1170,
        },
        {
          x: 1593379800000,
          y: 1170,
        },
        {
          x: 1593381600000,
          y: 1170,
        },
        {
          x: 1593383400000,
          y: 1170,
        },
        {
          x: 1593385200000,
          y: 1170,
        },
        {
          x: 1593387000000,
          y: 1170,
        },
        {
          x: 1593388800000,
          y: 1170,
        },
        {
          x: 1593390600000,
          y: 1170,
        },
        {
          x: 1593392400000,
          y: 1170,
        },
        {
          x: 1593394200000,
          y: 1239,
        },
        {
          x: 1593396000000,
          y: 1170,
        },
        {
          x: 1593397800000,
          y: 1170,
        },
        {
          x: 1593399600000,
          y: 1170,
        },
        {
          x: 1593401400000,
          y: 1170,
        },
        {
          x: 1593403200000,
          y: 1170,
        },
        {
          x: 1593405000000,
          y: 1170,
        },
        {
          x: 1593406800000,
          y: 1170,
        },
        {
          x: 1593408600000,
          y: 1170,
        },
        {
          x: 1593410400000,
          y: 1170,
        },
        {
          x: 1593412200000,
          y: 1170,
        },
        {
          x: 1593414000000,
          y: 1170,
        },
        {
          x: 1593415800000,
          y: 1170,
        },
        {
          x: 1593417600000,
          y: 1170,
        },
        {
          x: 1593419400000,
          y: 1170,
        },
        {
          x: 1593421200000,
          y: 1170,
        },
        {
          x: 1593423000000,
          y: 1170,
        },
        {
          x: 1593424800000,
          y: 1166,
        },
        {
          x: 1593426600000,
          y: 1206,
        },
        {
          x: 1593428400000,
          y: 1143,
        },
        {
          x: 1593430200000,
          y: 1170,
        },
        {
          x: 1593432000000,
          y: 1170,
        },
        {
          x: 1593433800000,
          y: 1170,
        },
        {
          x: 1593435600000,
          y: 1170,
        },
        {
          x: 1593437400000,
          y: 1170,
        },
        {
          x: 1593439200000,
          y: 1170,
        },
        {
          x: 1593441000000,
          y: 1170,
        },
        {
          x: 1593442800000,
          y: 1170,
        },
        {
          x: 1593444600000,
          y: 1170,
        },
        {
          x: 1593446400000,
          y: 1170,
        },
        {
          x: 1593448200000,
          y: 1170,
        },
        {
          x: 1593450000000,
          y: 1170,
        },
        {
          x: 1593451800000,
          y: 1170,
        },
        {
          x: 1593453600000,
          y: 1170,
        },
        {
          x: 1593455400000,
          y: 1170,
        },
        {
          x: 1593457200000,
          y: 1170,
        },
        {
          x: 1593459000000,
          y: 1170,
        },
        {
          x: 1593460800000,
          y: 1170,
        },
        {
          x: 1593462600000,
          y: 1170,
        },
        {
          x: 1593464400000,
          y: 1170,
        },
        {
          x: 1593466200000,
          y: 1170,
        },
        {
          x: 1593468000000,
          y: 1170,
        },
        {
          x: 1593469800000,
          y: 1170,
        },
        {
          x: 1593471600000,
          y: 1170,
        },
        {
          x: 1593473400000,
          y: 1170,
        },
        {
          x: 1593475200000,
          y: 1170,
        },
        {
          x: 1593477000000,
          y: 1170,
        },
        {
          x: 1593478800000,
          y: 1170,
        },
        {
          x: 1593480600000,
          y: 1201,
        },
        {
          x: 1593482400000,
          y: 1139,
        },
        {
          x: 1593484200000,
          y: 1140,
        },
        {
          x: 1593486000000,
          y: 1140,
        },
        {
          x: 1593487800000,
          y: 1140,
        },
        {
          x: 1593489600000,
          y: 1140,
        },
        {
          x: 1593491400000,
          y: 1140,
        },
        {
          x: 1593493200000,
          y: 1140,
        },
        {
          x: 1593495000000,
          y: 1140,
        },
        {
          x: 1593496800000,
          y: 1140,
        },
        {
          x: 1593498600000,
          y: 1140,
        },
        {
          x: 1593500400000,
          y: 1140,
        },
        {
          x: 1593502200000,
          y: 1140,
        },
        {
          x: 1593504000000,
          y: 1140,
        },
        {
          x: 1593505800000,
          y: 1140,
        },
        {
          x: 1593507600000,
          y: 1140,
        },
        {
          x: 1593509400000,
          y: 1140,
        },
        {
          x: 1593511200000,
          y: 1140,
        },
        {
          x: 1593513000000,
          y: 1140,
        },
        {
          x: 1593514800000,
          y: 1140,
        },
        {
          x: 1593516600000,
          y: 1140,
        },
        {
          x: 1593518400000,
          y: 1140,
        },
        {
          x: 1593520200000,
          y: 1140,
        },
        {
          x: 1593522000000,
          y: 1140,
        },
        {
          x: 1593523800000,
          y: 1140,
        },
        {
          x: 1593525600000,
          y: 1140,
        },
        {
          x: 1593527400000,
          y: 1140,
        },
        {
          x: 1593529200000,
          y: 1140,
        },
        {
          x: 1593531000000,
          y: 1140,
        },
        {
          x: 1593532800000,
          y: 1140,
        },
        {
          x: 1593534600000,
          y: 1140,
        },
        {
          x: 1593536400000,
          y: 1140,
        },
        {
          x: 1593538200000,
          y: 1140,
        },
        {
          x: 1593540000000,
          y: 1140,
        },
        {
          x: 1593541800000,
          y: 1139,
        },
        {
          x: 1593543600000,
          y: 1140,
        },
        {
          x: 1593545400000,
          y: 1140,
        },
        {
          x: 1593547200000,
          y: 1140,
        },
        {
          x: 1593549000000,
          y: 1140,
        },
        {
          x: 1593550800000,
          y: 1140,
        },
        {
          x: 1593552600000,
          y: 1140,
        },
      ],
    },
    down: {
      coordinates: [
        {
          x: 1593295200000,
          y: 234,
        },
        {
          x: 1593297000000,
          y: 234,
        },
        {
          x: 1593298800000,
          y: 234,
        },
        {
          x: 1593300600000,
          y: 234,
        },
        {
          x: 1593302400000,
          y: 234,
        },
        {
          x: 1593304200000,
          y: 234,
        },
        {
          x: 1593306000000,
          y: 234,
        },
        {
          x: 1593307800000,
          y: 234,
        },
        {
          x: 1593309600000,
          y: 234,
        },
        {
          x: 1593311400000,
          y: 234,
        },
        {
          x: 1593313200000,
          y: 234,
        },
        {
          x: 1593315000000,
          y: 234,
        },
        {
          x: 1593316800000,
          y: 234,
        },
        {
          x: 1593318600000,
          y: 234,
        },
        {
          x: 1593320400000,
          y: 234,
        },
        {
          x: 1593322200000,
          y: 234,
        },
        {
          x: 1593324000000,
          y: 234,
        },
        {
          x: 1593325800000,
          y: 234,
        },
        {
          x: 1593327600000,
          y: 234,
        },
        {
          x: 1593329400000,
          y: 234,
        },
        {
          x: 1593331200000,
          y: 234,
        },
        {
          x: 1593333000000,
          y: 234,
        },
        {
          x: 1593334800000,
          y: 234,
        },
        {
          x: 1593336600000,
          y: 234,
        },
        {
          x: 1593338400000,
          y: 234,
        },
        {
          x: 1593340200000,
          y: 234,
        },
        {
          x: 1593342000000,
          y: 234,
        },
        {
          x: 1593343800000,
          y: 234,
        },
        {
          x: 1593345600000,
          y: 234,
        },
        {
          x: 1593347400000,
          y: 234,
        },
        {
          x: 1593349200000,
          y: 234,
        },
        {
          x: 1593351000000,
          y: 234,
        },
        {
          x: 1593352800000,
          y: 234,
        },
        {
          x: 1593354600000,
          y: 234,
        },
        {
          x: 1593356400000,
          y: 234,
        },
        {
          x: 1593358200000,
          y: 234,
        },
        {
          x: 1593360000000,
          y: 234,
        },
        {
          x: 1593361800000,
          y: 234,
        },
        {
          x: 1593363600000,
          y: 234,
        },
        {
          x: 1593365400000,
          y: 234,
        },
        {
          x: 1593367200000,
          y: 234,
        },
        {
          x: 1593369000000,
          y: 234,
        },
        {
          x: 1593370800000,
          y: 234,
        },
        {
          x: 1593372600000,
          y: 234,
        },
        {
          x: 1593374400000,
          y: 235,
        },
        {
          x: 1593376200000,
          y: 234,
        },
        {
          x: 1593378000000,
          y: 234,
        },
        {
          x: 1593379800000,
          y: 234,
        },
        {
          x: 1593381600000,
          y: 234,
        },
        {
          x: 1593383400000,
          y: 234,
        },
        {
          x: 1593385200000,
          y: 234,
        },
        {
          x: 1593387000000,
          y: 234,
        },
        {
          x: 1593388800000,
          y: 234,
        },
        {
          x: 1593390600000,
          y: 234,
        },
        {
          x: 1593392400000,
          y: 234,
        },
        {
          x: 1593394200000,
          y: 246,
        },
        {
          x: 1593396000000,
          y: 234,
        },
        {
          x: 1593397800000,
          y: 234,
        },
        {
          x: 1593399600000,
          y: 234,
        },
        {
          x: 1593401400000,
          y: 234,
        },
        {
          x: 1593403200000,
          y: 234,
        },
        {
          x: 1593405000000,
          y: 234,
        },
        {
          x: 1593406800000,
          y: 234,
        },
        {
          x: 1593408600000,
          y: 234,
        },
        {
          x: 1593410400000,
          y: 234,
        },
        {
          x: 1593412200000,
          y: 234,
        },
        {
          x: 1593414000000,
          y: 234,
        },
        {
          x: 1593415800000,
          y: 234,
        },
        {
          x: 1593417600000,
          y: 234,
        },
        {
          x: 1593419400000,
          y: 234,
        },
        {
          x: 1593421200000,
          y: 234,
        },
        {
          x: 1593423000000,
          y: 234,
        },
        {
          x: 1593424800000,
          y: 240,
        },
        {
          x: 1593426600000,
          y: 254,
        },
        {
          x: 1593428400000,
          y: 231,
        },
        {
          x: 1593430200000,
          y: 234,
        },
        {
          x: 1593432000000,
          y: 234,
        },
        {
          x: 1593433800000,
          y: 234,
        },
        {
          x: 1593435600000,
          y: 234,
        },
        {
          x: 1593437400000,
          y: 234,
        },
        {
          x: 1593439200000,
          y: 234,
        },
        {
          x: 1593441000000,
          y: 234,
        },
        {
          x: 1593442800000,
          y: 234,
        },
        {
          x: 1593444600000,
          y: 234,
        },
        {
          x: 1593446400000,
          y: 234,
        },
        {
          x: 1593448200000,
          y: 234,
        },
        {
          x: 1593450000000,
          y: 234,
        },
        {
          x: 1593451800000,
          y: 234,
        },
        {
          x: 1593453600000,
          y: 234,
        },
        {
          x: 1593455400000,
          y: 234,
        },
        {
          x: 1593457200000,
          y: 234,
        },
        {
          x: 1593459000000,
          y: 234,
        },
        {
          x: 1593460800000,
          y: 234,
        },
        {
          x: 1593462600000,
          y: 234,
        },
        {
          x: 1593464400000,
          y: 234,
        },
        {
          x: 1593466200000,
          y: 234,
        },
        {
          x: 1593468000000,
          y: 234,
        },
        {
          x: 1593469800000,
          y: 234,
        },
        {
          x: 1593471600000,
          y: 234,
        },
        {
          x: 1593473400000,
          y: 234,
        },
        {
          x: 1593475200000,
          y: 234,
        },
        {
          x: 1593477000000,
          y: 234,
        },
        {
          x: 1593478800000,
          y: 234,
        },
        {
          x: 1593480600000,
          y: 254,
        },
        {
          x: 1593482400000,
          y: 265,
        },
        {
          x: 1593484200000,
          y: 264,
        },
        {
          x: 1593486000000,
          y: 264,
        },
        {
          x: 1593487800000,
          y: 264,
        },
        {
          x: 1593489600000,
          y: 264,
        },
        {
          x: 1593491400000,
          y: 264,
        },
        {
          x: 1593493200000,
          y: 264,
        },
        {
          x: 1593495000000,
          y: 264,
        },
        {
          x: 1593496800000,
          y: 264,
        },
        {
          x: 1593498600000,
          y: 264,
        },
        {
          x: 1593500400000,
          y: 264,
        },
        {
          x: 1593502200000,
          y: 264,
        },
        {
          x: 1593504000000,
          y: 264,
        },
        {
          x: 1593505800000,
          y: 264,
        },
        {
          x: 1593507600000,
          y: 264,
        },
        {
          x: 1593509400000,
          y: 264,
        },
        {
          x: 1593511200000,
          y: 264,
        },
        {
          x: 1593513000000,
          y: 264,
        },
        {
          x: 1593514800000,
          y: 264,
        },
        {
          x: 1593516600000,
          y: 264,
        },
        {
          x: 1593518400000,
          y: 264,
        },
        {
          x: 1593520200000,
          y: 264,
        },
        {
          x: 1593522000000,
          y: 264,
        },
        {
          x: 1593523800000,
          y: 264,
        },
        {
          x: 1593525600000,
          y: 264,
        },
        {
          x: 1593527400000,
          y: 264,
        },
        {
          x: 1593529200000,
          y: 264,
        },
        {
          x: 1593531000000,
          y: 264,
        },
        {
          x: 1593532800000,
          y: 264,
        },
        {
          x: 1593534600000,
          y: 264,
        },
        {
          x: 1593536400000,
          y: 264,
        },
        {
          x: 1593538200000,
          y: 264,
        },
        {
          x: 1593540000000,
          y: 264,
        },
        {
          x: 1593541800000,
          y: 265,
        },
        {
          x: 1593543600000,
          y: 264,
        },
        {
          x: 1593545400000,
          y: 264,
        },
        {
          x: 1593547200000,
          y: 264,
        },
        {
          x: 1593549000000,
          y: 264,
        },
        {
          x: 1593550800000,
          y: 264,
        },
        {
          x: 1593552600000,
          y: 264,
        },
      ],
    },
  },
};

export const emptyResponse: UptimeFetchDataResponse = {
  appLink: '/app/uptime#/',
  stats: {
    monitors: {
      type: 'number',
      value: 0,
    },
    up: {
      type: 'number',
      value: 0,
    },
    down: {
      type: 'number',
      value: 0,
    },
  },
  series: {
    up: {
      coordinates: [],
    },
    down: {
      coordinates: [],
    },
  },
};
