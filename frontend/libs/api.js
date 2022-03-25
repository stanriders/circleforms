export default async function api (endpoint, options) {
  if (process.env.NODE_ENV === 'development') {
    await wait(350)

    if (endpoint.includes('/posts/page')) {
      return [
        {
          "id": "623db4d2745ef1dd19eaad80",
          "author_id": "7217455",
          "is_active": true,
          "icon": null,
          "banner": null,
          "title": "An active form",
          "description": "how cool is that eh?",
          "publish_time": "2022-03-25T12:25:54.143Z",
          "accessibility": "Public",
          "limitations": {
            "rank": null,
            "pp": {
              "start": 1,
              "end": 10000
            },
            "gamemode": "Standard"
          }
        },
        {
          "id": "623d11660b337d32004023d1",
          "author_id": "7217455",
          "is_active": true,
          "icon": "gusenitsa_smol.png",
          "banner": "68747470733a2f2f692e696d6775722e636f6d2f7a6334667671462e706e67.png",
          "title": "ex cupidatat nisi",
          "description": "labore tempor",
          "publish_time": "2022-03-25T00:48:38.014Z",
          "accessibility": "Public",
          "limitations": {
            "rank": {
              "start": 1000,
              "end": 2000
            },
            "pp": {
              "start": 2000,
              "end": 3000
            },
            "gamemode": "Mania"
          }
        },
        {
          "id": "623d11650b337d32004023d0",
          "author_id": "7217455",
          "is_active": false,
          "icon": null,
          "banner": null,
          "title": "ex cupidatat nisi",
          "description": "labore tempor",
          "publish_time": "2022-03-25T00:48:37.8369548Z",
          "accessibility": "Public",
          "limitations": {
            "rank": {
              "start": 1000,
              "end": 2000
            },
            "pp": {
              "start": 2000,
              "end": 3000
            },
            "gamemode": "Mania"
          }
        },
        {
          "id": "623d11650b337d32004023cf",
          "author_id": "7217455",
          "is_active": false,
          "icon": null,
          "banner": null,
          "title": "ex cupidatat nisi",
          "description": "labore tempor",
          "publish_time": "2022-03-25T00:48:37.6637777Z",
          "accessibility": "Public",
          "limitations": {
            "rank": {
              "start": 1000,
              "end": 2000
            },
            "pp": {
              "start": 2000,
              "end": 3000
            },
            "gamemode": "Mania"
          }
        },
        {
          "id": "623d11650b337d32004023ce",
          "author_id": "7217455",
          "is_active": false,
          "icon": null,
          "banner": null,
          "title": "ex cupidatat nisi",
          "description": "labore tempor",
          "publish_time": "2022-03-25T00:48:37.3837636Z",
          "accessibility": "Public",
          "limitations": {
            "rank": {
              "start": 1000,
              "end": 2000
            },
            "pp": {
              "start": 2000,
              "end": 3000
            },
            "gamemode": "Mania"
          }
        },
      ]
    }

    if (endpoint === '/me') {
      return {
        "id": "5914915",
        "posts": [

        ],
        "avatar_url": "https://a.ppy.sh/5914915?1639077555.jpeg",
        "country_code": "FR",
        "is_supporter": true,
        "username": "Nemesis-",
        "discord": "Keziah#6631",
        "osu_join_date": "2015-02-08T16:02:11Z",
        "playmode": "osu",
        "badges": [

        ],
        "monthly_playcounts": [
          {
            "start_date": "2015-02-01T00:00:00Z",
            "count": 413
          },
          {
            "start_date": "2015-03-01T00:00:00Z",
            "count": 885
          },
          {
            "start_date": "2015-04-01T00:00:00Z",
            "count": 1047
          },
          {
            "start_date": "2015-05-01T00:00:00Z",
            "count": 372
          },
          {
            "start_date": "2015-06-01T00:00:00Z",
            "count": 400
          },
          {
            "start_date": "2015-07-01T00:00:00Z",
            "count": 1113
          },
          {
            "start_date": "2015-08-01T00:00:00Z",
            "count": 1391
          },
          {
            "start_date": "2015-09-01T00:00:00Z",
            "count": 448
          },
          {
            "start_date": "2015-10-01T00:00:00Z",
            "count": 994
          },
          {
            "start_date": "2015-11-01T00:00:00Z",
            "count": 1868
          },
          {
            "start_date": "2015-12-01T00:00:00Z",
            "count": 1297
          },
          {
            "start_date": "2016-01-01T00:00:00Z",
            "count": 966
          },
          {
            "start_date": "2016-02-01T00:00:00Z",
            "count": 821
          },
          {
            "start_date": "2016-03-01T00:00:00Z",
            "count": 1269
          },
          {
            "start_date": "2016-04-01T00:00:00Z",
            "count": 1966
          },
          {
            "start_date": "2016-05-01T00:00:00Z",
            "count": 1673
          },
          {
            "start_date": "2016-06-01T00:00:00Z",
            "count": 1149
          },
          {
            "start_date": "2016-07-01T00:00:00Z",
            "count": 1116
          },
          {
            "start_date": "2016-08-01T00:00:00Z",
            "count": 1332
          },
          {
            "start_date": "2016-09-01T00:00:00Z",
            "count": 463
          },
          {
            "start_date": "2016-10-01T00:00:00Z",
            "count": 959
          },
          {
            "start_date": "2016-11-01T00:00:00Z",
            "count": 988
          },
          {
            "start_date": "2016-12-01T00:00:00Z",
            "count": 1625
          },
          {
            "start_date": "2017-01-01T00:00:00Z",
            "count": 768
          },
          {
            "start_date": "2017-02-01T00:00:00Z",
            "count": 730
          },
          {
            "start_date": "2017-03-01T00:00:00Z",
            "count": 542
          },
          {
            "start_date": "2017-04-01T00:00:00Z",
            "count": 342
          },
          {
            "start_date": "2017-05-01T00:00:00Z",
            "count": 762
          },
          {
            "start_date": "2017-06-01T00:00:00Z",
            "count": 1254
          },
          {
            "start_date": "2017-07-01T00:00:00Z",
            "count": 930
          },
          {
            "start_date": "2017-08-01T00:00:00Z",
            "count": 727
          },
          {
            "start_date": "2017-09-01T00:00:00Z",
            "count": 183
          },
          {
            "start_date": "2017-10-01T00:00:00Z",
            "count": 375
          },
          {
            "start_date": "2017-11-01T00:00:00Z",
            "count": 500
          },
          {
            "start_date": "2017-12-01T00:00:00Z",
            "count": 274
          },
          {
            "start_date": "2018-01-01T00:00:00Z",
            "count": 241
          },
          {
            "start_date": "2018-02-01T00:00:00Z",
            "count": 165
          },
          {
            "start_date": "2018-03-01T00:00:00Z",
            "count": 1132
          },
          {
            "start_date": "2018-04-01T00:00:00Z",
            "count": 357
          },
          {
            "start_date": "2018-05-01T00:00:00Z",
            "count": 379
          },
          {
            "start_date": "2018-06-01T00:00:00Z",
            "count": 508
          },
          {
            "start_date": "2018-07-01T00:00:00Z",
            "count": 318
          },
          {
            "start_date": "2018-08-01T00:00:00Z",
            "count": 393
          },
          {
            "start_date": "2018-09-01T00:00:00Z",
            "count": 133
          },
          {
            "start_date": "2018-10-01T00:00:00Z",
            "count": 371
          },
          {
            "start_date": "2018-11-01T00:00:00Z",
            "count": 459
          },
          {
            "start_date": "2018-12-01T00:00:00Z",
            "count": 283
          },
          {
            "start_date": "2019-01-01T00:00:00Z",
            "count": 24
          },
          {
            "start_date": "2019-02-01T00:00:00Z",
            "count": 127
          },
          {
            "start_date": "2019-03-01T00:00:00Z",
            "count": 100
          },
          {
            "start_date": "2019-04-01T00:00:00Z",
            "count": 4
          },
          {
            "start_date": "2019-09-01T00:00:00Z",
            "count": 162
          },
          {
            "start_date": "2019-10-01T00:00:00Z",
            "count": 626
          },
          {
            "start_date": "2019-11-01T00:00:00Z",
            "count": 315
          },
          {
            "start_date": "2019-12-01T00:00:00Z",
            "count": 440
          },
          {
            "start_date": "2020-03-01T00:00:00Z",
            "count": 24
          },
          {
            "start_date": "2020-04-01T00:00:00Z",
            "count": 52
          },
          {
            "start_date": "2020-05-01T00:00:00Z",
            "count": 69
          },
          {
            "start_date": "2020-06-01T00:00:00Z",
            "count": 32
          },
          {
            "start_date": "2020-08-01T00:00:00Z",
            "count": 41
          },
          {
            "start_date": "2020-09-01T00:00:00Z",
            "count": 22
          },
          {
            "start_date": "2021-03-01T00:00:00Z",
            "count": 76
          },
          {
            "start_date": "2021-04-01T00:00:00Z",
            "count": 1157
          },
          {
            "start_date": "2021-05-01T00:00:00Z",
            "count": 2217
          },
          {
            "start_date": "2021-06-01T00:00:00Z",
            "count": 1832
          },
          {
            "start_date": "2021-07-01T00:00:00Z",
            "count": 2107
          },
          {
            "start_date": "2021-08-01T00:00:00Z",
            "count": 713
          },
          {
            "start_date": "2021-09-01T00:00:00Z",
            "count": 217
          },
          {
            "start_date": "2021-10-01T00:00:00Z",
            "count": 1368
          },
          {
            "start_date": "2021-11-01T00:00:00Z",
            "count": 1465
          },
          {
            "start_date": "2021-12-01T00:00:00Z",
            "count": 2309
          },
          {
            "start_date": "2022-01-01T00:00:00Z",
            "count": 1191
          },
          {
            "start_date": "2022-02-01T00:00:00Z",
            "count": 1545
          },
          {
            "start_date": "2022-03-01T00:00:00Z",
            "count": 575
          }
        ],
        "previous_usernames": [
          "Exodiah"
        ],
        "statistics": {
          "level": {
            "current": 100,
            "progress": 54
          },
          "global_rank": 4001,
          "country_rank": 136,
          "pp": 8697.77,
          "ranked_score": 20643008193,
          "hit_accuracy": 96.7987,
          "play_count": 54395,
          "play_time": 3321736,
          "total_score": 81863867208,
          "total_hits": 14265467,
          "maximum_combo": 2554,
          "replays_watched_by_others": 29,
          "is_ranked": true,
          "grade_counts": {
            "ss": 35,
            "ssh": 5,
            "s": 950,
            "sh": 67,
            "a": 1714
          }
        },
        "rank_history": {
          "mode": "osu",
          "data": [
            3797,
            3798,
            3802,
            3809,
            3809,
            3815,
            3818,
            3826,
            3829,
            3833,
            3836,
            3839,
            3846,
            3849,
            3852,
            3856,
            3857,
            3862,
            3868,
            3872,
            3874,
            3877,
            3881,
            3886,
            3892,
            3890,
            3898,
            3902,
            3911,
            3918,
            3921,
            3925,
            3927,
            3931,
            3938,
            3941,
            3945,
            3947,
            3957,
            3965,
            3913,
            3913,
            3917,
            3924,
            3929,
            3934,
            3942,
            3882,
            3883,
            3890,
            3894,
            3814,
            3819,
            3823,
            3832,
            3842,
            3846,
            3848,
            3850,
            3856,
            3862,
            3870,
            3875,
            3880,
            3880,
            3880,
            3888,
            3894,
            3898,
            3902,
            3909,
            3916,
            3919,
            3926,
            3931,
            3934,
            3940,
            3947,
            3956,
            3960,
            3966,
            3967,
            3971,
            3972,
            3978,
            3986,
            3988,
            3992,
            3995,
            4001
          ]
        }
      }
    }
  }

  const response = await fetch(`https://circleforms.net/api${endpoint}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  })

  if (response.status === 204) {
    return null
  }

  const responseData = await response.json()

  if (response.ok) {
    return responseData
  }

  throw responseData
}

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}