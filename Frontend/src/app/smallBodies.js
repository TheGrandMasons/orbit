const smallBodies = [
  // NEOs and PHAs
  {
    name: "Apophis",
    radius: 0.25,
    color: 0x808080,
    a: 110.5,
    e: 0.191,
    i: 3.34,
    omega: 204.7,
    w: 126.4,
    M0: 191.8,
    epoch: 2451545.0,
    period: 0.9,
  },
  {
    name: "Bennu",
    radius: 0.26,
    color: 0x707070,
    a: 134.9,
    e: 0.203,
    i: 6.04,
    omega: 2.2,
    w: 66.2,
    M0: 101.7,
    epoch: 2451545.0,
    period: 1.2,
  },
  {
    name: "Florence",
    radius: 0.75,
    color: 0xb0b0b0,
    a: 150.3,
    e: 0.284,
    i: 11.6,
    omega: 335.3,
    w: 44.5,
    M0: 12.7,
    epoch: 2451545.0,
    period: 1.4,
  },
  {
    name: "1994 CC",
    radius: 0.1,
    color: 0x9c9c9c,
    a: 125.4,
    e: 0.103,
    i: 5.88,
    omega: 159.6,
    w: 123.7,
    M0: 203.5,
    epoch: 2451545.0,
    period: 1.1,
  },
  {
    name: "1950 DA",
    radius: 0.66,
    color: 0xa0a0a0,
    a: 146.1,
    e: 0.489,
    i: 12.2,
    omega: 24.8,
    w: 124.6,
    M0: 141.2,
    epoch: 2451545.0,
    period: 1.3,
  },
  {
    name: "Didymos",
    radius: 0.4,
    color: 0xc0c0c0,
    a: 105.6,
    e: 0.082,
    i: 3.9,
    omega: 73.4,
    w: 117.3,
    M0: 76.5,
    epoch: 2451545.0,
    period: 0.7,
  },
  {
    name: "Golevka",
    radius: 0.33,
    color: 0x666666,
    a: 139.8,
    e: 0.121,
    i: 2.2,
    omega: 92.3,
    w: 132.4,
    M0: 89.5,
    epoch: 2451545.0,
    period: 1.25,
  },
  {
    name: "Eros",
    radius: 0.17,
    color: 0xffb6c1,
    a: 173.2,
    e: 0.223,
    i: 10.83,
    omega: 304.7,
    w: 178.8,
    M0: 211.6,
    epoch: 2451545.0,
    period: 1.8,
  },
  {
    name: "Aten",
    radius: 0.18,
    color: 0x404040,
    a: 80.6,
    e: 0.307,
    i: 5.23,
    omega: 137.2,
    w: 298.6,
    M0: 49.1,
    epoch: 2451545.0,
    period: 0.55,
  },
  {
    name: "Hathor",
    radius: 0.12,
    color: 0x939393,
    a: 83.3,
    e: 0.441,
    i: 6.68,
    omega: 128.6,
    w: 181.5,
    M0: 321.2,
    epoch: 2451545.0,
    period: 0.6,
  },
  {
    name: "Icarus",
    radius: 0.22,
    color: 0xd4a017,
    a: 122.5,
    e: 0.827,
    i: 22.8,
    omega: 87.7,
    w: 31.3,
    M0: 159.4,
    epoch: 2451545.0,
    period: 1.1,
  },
  {
    name: "Toutatis",
    radius: 0.4,
    color: 0xa1a1a1,
    a: 148.4,
    e: 0.63,
    i: 0.47,
    omega: 54.6,
    w: 274.3,
    M0: 138.9,
    epoch: 2451545.0,
    period: 1.3,
  },
  {
    name: "2015 TB145",
    radius: 0.55,
    color: 0x808080,
    a: 143.6,
    e: 0.31,
    i: 39.81,
    omega: 278.6,
    w: 176.5,
    M0: 72.8,
    epoch: 2451545.0,
    period: 1.27,
  },
  {
    name: "Orpheus",
    radius: 0.15,
    color: 0xd4a017,
    a: 114.3,
    e: 0.323,
    i: 2.68,
    omega: 188.5,
    w: 122.2,
    M0: 99.3,
    epoch: 2451545.0,
    period: 0.9,
  },
  {
    name: "2005 YU55",
    radius: 0.36,
    color: 0x505050,
    a: 138.9,
    e: 0.43,
    i: 0.49,
    omega: 52.2,
    w: 33.9,
    M0: 108.5,
    epoch: 2451545.0,
    period: 1.25,
  },
  {
    name: "1999 RQ36",
    radius: 0.3,
    color: 0x202020,
    a: 112.1,
    e: 0.203,
    i: 1.4,
    omega: 58.7,
    w: 28.3,
    M0: 287.5,
    epoch: 2451545.0,
    period: 1.0,
  },
  {
    name: "2004 MN4",
    radius: 0.33,
    color: 0x606060,
    a: 99.9,
    e: 0.342,
    i: 7.2,
    omega: 90.3,
    w: 250.1,
    M0: 182.7,
    epoch: 2451545.0,
    period: 0.88,
  },
  {
    name: "Ra-Shalom",
    radius: 0.14,
    color: 0x898989,
    a: 77.8,
    e: 0.443,
    i: 15.7,
    omega: 159.6,
    w: 309.5,
    M0: 111.2,
    epoch: 2451545.0,
    period: 0.5,
  },
  {
    name: "1981 Midas",
    radius: 0.27,
    color: 0x303030,
    a: 129.6,
    e: 0.65,
    i: 39.82,
    omega: 180.2,
    w: 150.8,
    M0: 199.3,
    epoch: 2451545.0,
    period: 1.05,
  },
  {
    name: "Geographos",
    radius: 0.2,
    color: 0xc8c8c8,
    a: 130.0,
    e: 0.335,
    i: 13.34,
    omega: 276.9,
    w: 336.5,
    M0: 44.8,
    epoch: 2451545.0,
    period: 1.05,
  },
  {
    name: "Orpheus",
    radius: 0.15,
    color: 0x696969,
    a: 130.2,
    e: 0.323,
    i: 2.68,
    omega: 330.6,
    w: 239.3,
    M0: 15.4,
    epoch: 2451545.0,
    period: 1.18,
  },
  {
    name: "1981 Midas",
    radius: 0.75,
    color: 0xffd700,
    a: 143.2,
    e: 0.652,
    i: 39.84,
    omega: 81.9,
    w: 83.7,
    M0: 45.8,
    epoch: 2451545.0,
    period: 1.36,
  },
  {
    name: "Ganymed",
    radius: 2.0,
    color: 0xa9a9a9,
    a: 244.7,
    e: 0.534,
    i: 26.69,
    omega: 295.3,
    w: 132.3,
    M0: 87.6,
    epoch: 2451545.0,
    period: 4.33,
  },
  {
    name: "Florence",
    radius: 2.7,
    color: 0xffc0cb,
    a: 152.6,
    e: 0.423,
    i: 22.14,
    omega: 337.2,
    w: 132.4,
    M0: 290.2,
    epoch: 2451545.0,
    period: 2.35,
  },
  {
    name: "Phaethon",
    radius: 0.275,
    color: 0x0000ff,
    a: 139.7,
    e: 0.890,
    i: 22.24,
    omega: 265.4,
    w: 322.6,
    M0: 242.8,
    epoch: 2451545.0,
    period: 1.43,
  },
  {
    name: "Toutatis",
    radius: 1.4,
    color: 0x808080,
    a: 170.6,
    e: 0.634,
    i: 0.47,
    omega: 122.5,
    w: 274.1,
    M0: 188.7,
    epoch: 2451545.0,
    period: 2.52,
  },
  {
    name: "Icarus",
    radius: 0.6,
    color: 0x8b0000,
    a: 104.2,
    e: 0.827,
    i: 22.83,
    omega: 87.6,
    w: 31.4,
    M0: 185.9,
    epoch: 2451545.0,
    period: 1.12,
  },
  {
    name: "Eros",
    radius: 2.0,
    color: 0xcd853f,
    a: 172.8,
    e: 0.223,
    i: 10.83,
    omega: 304.4,
    w: 178.0,
    M0: 254.4,
    epoch: 2451545.0,
    period: 1.76,
  },
  {
    name: "1999 KW4",
    radius: 0.67,
    color: 0xff4500,
    a: 135.4,
    e: 0.688,
    i: 38.88,
    omega: 52.4,
    w: 204.9,
    M0: 12.7,
    epoch: 2451545.0,
    period: 1.21,
  },
  {
    name: "Ryugu",
    radius: 0.45,
    color: 0x8b4513,
    a: 135.7,
    e: 0.190,
    i: 5.88,
    omega: 251.4,
    w: 211.5,
    M0: 178.6,
    epoch: 2451545.0,
    period: 1.31,
  },
  {
    name: "Didymos",
    radius: 0.375,
    color: 0xff6347,
    a: 148.7,
    e: 0.384,
    i: 3.41,
    omega: 73.2,
    w: 318.7,
    M0: 45.6,
    epoch: 2451545.0,
    period: 2.11,
  },
  {
    name: "2005 YU55",
    radius: 0.2,
    color: 0x778899,
    a: 149.6,
    e: 0.430,
    i: 0.47,
    omega: 49.1,
    w: 325.7,
    M0: 101.5,
    epoch: 2451545.0,
    period: 1.26,
  },
  {
    name: "1989 JA",
    radius: 0.55,
    color: 0xff1493,
    a: 154.2,
    e: 0.255,
    i: 15.85,
    omega: 254.2,
    w: 104.1,
    M0: 304.3,
    epoch: 2451545.0,
    period: 2.39,
  },
  {
    name: "1994 PC1",
    radius: 0.575,
    color: 0xb22222,
    a: 147.5,
    e: 0.335,
    i: 33.54,
    omega: 165.8,
    w: 288.6,
    M0: 95.7,
    epoch: 2451545.0,
    period: 1.78,
  },
  {
    name: "Geographos",
    radius: 0.575,
    color: 0x2f4f4f,
    a: 146.9,
    e: 0.335,
    i: 13.34,
    omega: 336.9,
    w: 276.1,
    M0: 88.9,
    epoch: 2451545.0,
    period: 1.67,
  },
  {
    name: "1998 OR2",
    radius: 1.1,
    color: 0xa52a2a,
    a: 185.6,
    e: 0.573,
    i: 6.37,
    omega: 220.2,
    w: 174.7,
    M0: 5.3,
    epoch: 2451545.0,
    period: 3.07,
  },
  {
    name: "2021 PDC",
    radius: 0.55,
    color: 0xdaa520,
    a: 144.5,
    e: 0.385,
    i: 16.23,
    omega: 131.4,
    w: 249.7,
    M0: 47.4,
    epoch: 2451545.0,
    period: 1.33,
  },
  {
    name: "1997 XF11",
    radius: 1.0,
    color: 0x696969,
    a: 170.5,
    e: 0.479,
    i: 4.29,
    omega: 177.5,
    w: 311.8,
    M0: 167.3,
    epoch: 2451545.0,
    period: 2.29,
  },
  {
    name: "2002 NY40",
    radius: 0.275,
    color: 0x9acd32,
    a: 121.7,
    e: 0.472,
    i: 3.54,
    omega: 300.1,
    w: 52.4,
    M0: 305.2,
    epoch: 2451545.0,
    period: 1.03,
  },
  {
    name: "2003 SD220",
    radius: 0.95,
    color: 0x00008b,
    a: 152.9,
    e: 0.476,
    i: 7.26,
    omega: 214.9,
    w: 140.3,
    M0: 56.2,
    epoch: 2451545.0,
    period: 1.92,
  },
  {
    name: "2000 SG344",
    radius: 0.05,
    color: 0x4682b4,
    a: 99.0,
    e: 0.067,
    i: 0.11,
    omega: 288.6,
    w: 249.8,
    M0: 34.9,
    epoch: 2451545.0,
    period: 0.93,
  },
  {
    name: "1991 VG",
    radius: 0.06,
    color: 0xd2691e,
    a: 99.7,
    e: 0.048,
    i: 1.39,
    omega: 190.8,
    w: 131.9,
    M0: 315.3,
    epoch: 2451545.0,
    period: 0.96,
  },
  // Inner Astroid Belt
  {
    name: "Ceres",
    radius: 4.6,
    color: 0xc0c0c0,
    a: 414.0,
    e: 0.0758,
    i: 10.59,
    omega: 80.3,
    w: 73.6,
    M0: 95.7,
    epoch: 2451545.0,
    period: 4.60,
  },
  {
    name: "Vesta",
    radius: 2.6,
    color: 0xf4a460,
    a: 353.4,
    e: 0.089,
    i: 7.14,
    omega: 103.8,
    w: 150.7,
    M0: 151.3,
    epoch: 2451545.0,
    period: 3.63,
  },
  {
    name: "Pallas",
    radius: 2.6,
    color: 0x87ceeb,
    a: 414.4,
    e: 0.230,
    i: 34.83,
    omega: 173.1,
    w: 310.0,
    M0: 80.4,
    epoch: 2451545.0,
    period: 4.62,
  },
  {
    name: "Hygiea",
    radius: 2.15,
    color: 0xa0a0a0,
    a: 470.3,
    e: 0.117,
    i: 3.83,
    omega: 283.7,
    w: 312.2,
    M0: 277.1,
    epoch: 2451545.0,
    period: 5.56,
  },
  {
    name: "Eunomia",
    radius: 1.55,
    color: 0xd2b48c,
    a: 395.5,
    e: 0.186,
    i: 11.74,
    omega: 97.9,
    w: 97.6,
    M0: 228.9,
    epoch: 2451545.0,
    period: 4.27,
  },
  {
    name: "Juno",
    radius: 1.2,
    color: 0x4682b4,
    a: 299.2,
    e: 0.256,
    i: 12.98,
    omega: 169.9,
    w: 248.4,
    M0: 187.5,
    epoch: 2451545.0,
    period: 2.67,
  },
  {
    name: "Psyche",
    radius: 1.1,
    color: 0x708090,
    a: 436.6,
    e: 0.140,
    i: 3.09,
    omega: 153.0,
    w: 211.7,
    M0: 173.4,
    epoch: 2451545.0,
    period: 4.95,
  },
  {
    name: "Davida",
    radius: 1.7,
    color: 0x778899,
    a: 475.1,
    e: 0.184,
    i: 15.94,
    omega: 285.3,
    w: 227.4,
    M0: 59.8,
    epoch: 2451545.0,
    period: 5.65,
  },
  {
    name: "Interamnia",
    radius: 1.5,
    color: 0x808080,
    a: 482.6,
    e: 0.154,
    i: 17.31,
    omega: 90.7,
    w: 52.1,
    M0: 97.5,
    epoch: 2451545.0,
    period: 5.88,
  },
  {
    name: "Euphrosyne",
    radius: 1.25,
    color: 0xa9a9a9,
    a: 456.8,
    e: 0.212,
    i: 26.29,
    omega: 235.3,
    w: 108.1,
    M0: 144.4,
    epoch: 2451545.0,
    period: 5.49,
  },
  {
    name: "Bamberga",
    radius: 1.1,
    color: 0xbdb76b,
    a: 378.3,
    e: 0.342,
    i: 11.10,
    omega: 276.3,
    w: 122.9,
    M0: 267.7,
    epoch: 2451545.0,
    period: 3.69,
  },
  {
    name: "Themis",
    radius: 1.15,
    color: 0x2e8b57,
    a: 471.7,
    e: 0.130,
    i: 0.76,
    omega: 176.5,
    w: 160.6,
    M0: 88.7,
    epoch: 2451545.0,
    period: 5.59,
  },
  {
    name: "Hebe",
    radius: 1.0,
    color: 0xff4500,
    a: 293.0,
    e: 0.203,
    i: 14.76,
    omega: 138.9,
    w: 239.3,
    M0: 319.8,
    epoch: 2451545.0,
    period: 2.55,
  },
  {
    name: "Iris",
    radius: 0.8,
    color: 0xff6347,
    a: 299.2,
    e: 0.231,
    i: 5.53,
    omega: 144.1,
    w: 72.5,
    M0: 256.1,
    epoch: 2451545.0,
    period: 2.67,
  },
  {
    name: "Metis",
    radius: 0.9,
    color: 0xffa07a,
    a: 343.3,
    e: 0.123,
    i: 5.57,
    omega: 72.7,
    w: 31.3,
    M0: 180.6,
    epoch: 2451545.0,
    period: 3.39,
  },
  {
    name: "Fortuna",
    radius: 1.05,
    color: 0xdeb887,
    a: 376.7,
    e: 0.157,
    i: 1.57,
    omega: 145.3,
    w: 110.8,
    M0: 59.9,
    epoch: 2451545.0,
    period: 3.66,
  },
  {
    name: "Massalia",
    radius: 0.7,
    color: 0x8b4513,
    a: 274.1,
    e: 0.142,
    i: 1.40,
    omega: 149.8,
    w: 209.3,
    M0: 92.1,
    epoch: 2451545.0,
    period: 2.27,
  },
  {
    name: "Amphitrite",
    radius: 1.05,
    color: 0xf5deb3,
    a: 378.2,
    e: 0.072,
    i: 6.09,
    omega: 145.2,
    w: 78.1,
    M0: 35.6,
    epoch: 2451545.0,
    period: 3.69,
  },
  {
    name: "Aurora",
    radius: 0.95,
    color: 0xffdab9,
    a: 438.3,
    e: 0.228,
    i: 5.37,
    omega: 81.3,
    w: 94.1,
    M0: 122.4,
    epoch: 2451545.0,
    period: 4.98,
  },
  {
    name: "Vibilia",
    radius: 0.8,
    color: 0x7fffd4,
    a: 412.9,
    e: 0.078,
    i: 6.87,
    omega: 50.2,
    w: 102.7,
    M0: 83.2,
    epoch: 2451545.0,
    period: 4.58,
  },
  {
    name: "Eunomia",
    radius: 1.9,
    color: 0xd3d3d3,
    a: 395.1,
    e: 0.186,
    i: 11.75,
    omega: 98.5,
    w: 293.7,
    M0: 257.9,
    epoch: 2451545.0,
    period: 5.46,
  },
  {
    name: "Juno",
    radius: 1.2,
    color: 0xdda0dd,
    a: 300.2,
    e: 0.255,
    i: 13.0,
    omega: 170.3,
    w: 248.2,
    M0: 250.1,
    epoch: 2451545.0,
    period: 4.36,
  },
  {
    name: "Egeria",
    radius: 1.7,
    color: 0xffe4c4,
    a: 413.2,
    e: 0.089,
    i: 16.55,
    omega: 82.7,
    w: 298.4,
    M0: 32.6,
    epoch: 2451545.0,
    period: 5.85,
  },
  {
    name: "Metis",
    radius: 1.2,
    color: 0xf5deb3,
    a: 346.7,
    e: 0.124,
    i: 5.57,
    omega: 42.5,
    w: 184.8,
    M0: 111.9,
    epoch: 2451545.0,
    period: 5.01,
  },
  {
    name: "Iris",
    radius: 1.1,
    color: 0xffb6c1,
    a: 327.7,
    e: 0.231,
    i: 5.53,
    omega: 145.9,
    w: 259.4,
    M0: 244.2,
    epoch: 2451545.0,
    period: 4.56,
  },
  {
    name: "Victoria",
    radius: 1.5,
    color: 0xf08080,
    a: 359.4,
    e: 0.140,
    i: 8.36,
    omega: 297.3,
    w: 150.7,
    M0: 182.5,
    epoch: 2451545.0,
    period: 5.23,
  },
  {
    name: "Amphitrite",
    radius: 2.1,
    color: 0xeee8aa,
    a: 375.5,
    e: 0.074,
    i: 6.09,
    omega: 191.7,
    w: 288.9,
    M0: 105.1,
    epoch: 2451545.0,
    period: 5.58,
  },
  {
    name: "Psyche",
    radius: 1.5,
    color: 0xcd5c5c,
    a: 377.5,
    e: 0.140,
    i: 3.10,
    omega: 150.3,
    w: 278.7,
    M0: 198.7,
    epoch: 2451545.0,
    period: 5.60,
  },
  {
    name: "Fortuna",
    radius: 2.0,
    color: 0xd2b48c,
    a: 371.0,
    e: 0.158,
    i: 1.57,
    omega: 56.8,
    w: 342.4,
    M0: 154.3,
    epoch: 2451545.0,
    period: 5.52,
  },
  {
    name: "Hebe",
    radius: 1.8,
    color: 0xffdead,
    a: 293.7,
    e: 0.202,
    i: 14.77,
    omega: 138.7,
    w: 246.3,
    M0: 37.6,
    epoch: 2451545.0,
    period: 4.26,
  },
  {
    name: "Massalia",
    radius: 1.0,
    color: 0xbdb76b,
    a: 330.8,
    e: 0.144,
    i: 0.47,
    omega: 62.5,
    w: 178.4,
    M0: 94.8,
    epoch: 2451545.0,
    period: 4.61,
  },
  {
    name: "Lutetia",
    radius: 2.0,
    color: 0x8fbc8f,
    a: 371.0,
    e: 0.159,
    i: 3.06,
    omega: 162.4,
    w: 298.9,
    M0: 145.1,
    epoch: 2451545.0,
    period: 5.55,
  },
  {
    name: "Melpomene",
    radius: 1.3,
    color: 0xdaa520,
    a: 293.8,
    e: 0.223,
    i: 10.12,
    omega: 134.5,
    w: 283.6,
    M0: 92.4,
    epoch: 2451545.0,
    period: 4.27,
  },
  {
    name: "Kalliope",
    radius: 2.3,
    color: 0xa0522d,
    a: 413.7,
    e: 0.102,
    i: 13.68,
    omega: 22.3,
    w: 312.7,
    M0: 268.6,
    epoch: 2451545.0,
    period: 5.85,
  },
  {
    name: "Harmonia",
    radius: 1.6,
    color: 0x5f9ea0,
    a: 332.2,
    e: 0.109,
    i: 3.05,
    omega: 94.6,
    w: 198.5,
    M0: 25.7,
    epoch: 2451545.0,
    period: 4.63,
  },
  {
    name: "Antiope",
    radius: 1.9,
    color: 0x7fffd4,
    a: 429.8,
    e: 0.220,
    i: 2.21,
    omega: 240.3,
    w: 34.8,
    M0: 192.6,
    epoch: 2451545.0,
    period: 6.28,
  },
  {
    name: "Bamberga",
    radius: 2.4,
    color: 0xb8860b,
    a: 400.7,
    e: 0.334,
    i: 11.11,
    omega: 12.5,
    w: 87.6,
    M0: 70.9,
    epoch: 2451545.0,
    period: 5.69,
  },
  {
    name: "Euphrosyne",
    radius: 2.6,
    color: 0x4682b4,
    a: 395.2,
    e: 0.268,
    i: 26.80,
    omega: 12.6,
    w: 67.7,
    M0: 83.5,
    epoch: 2451545.0,
    period: 5.53,
  },
  {
    name: "Astraea",
    radius: 1.1,
    color: 0x2e8b57,
    a: 307.9,
    e: 0.192,
    i: 5.37,
    omega: 94.3,
    w: 245.8,
    M0: 217.5,
    epoch: 2451545.0,
    period: 4.49,
  },
  {
    name: "Cybele",
    radius: 2.2,
    color: 0xff69b4,
    a: 474.4,
    e: 0.102,
    i: 3.57,
    omega: 204.5,
    w: 217.4,
    M0: 53.8,
    epoch: 2451545.0,
    period: 6.74,
  },
  // Outer Astroid Belt
];

export default smallBodies;