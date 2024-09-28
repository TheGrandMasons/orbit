const celestialBodies = [
  { name: "Sun", radius: 20, color: 0xffff00, mass: 1.989e30 },
  {
    name: "Mercury",
    radius: 3,
    color: 0x8c7853,
    a: 38.7,
    e: 0.206,
    i: 7.0,
    omega: 48.3,
    w: 29.1,
    M0: 174.8,
    epoch: 2451545.0,
    period: 0.241,
  },
  {
    name: "Venus",
    radius: 4,
    color: 0xffd700,
    a: 72.3,
    e: 0.007,
    i: 3.4,
    omega: 76.7,
    w: 54.9,
    M0: 50.4,
    epoch: 2451545.0,
    period: 0.615,
  },
  {
    name: "Earth",
    radius: 4,
    color: 0x0000ff,
    a: 100,
    e: 0.017,
    i: 0.0,
    omega: 348.7,
    w: 114.2,
    M0: 357.5,
    epoch: 2451545.0,
    period: 1.0,
  },
  {
    name: "Shahd",
    radius: 1.5,
    color: 0xcccccc,
    a: 10,
    e: 0.0549,
    i: 5.145,
    omega: 125.08,
    w: 318.15,
    M0: 135.27,
    epoch: 2451545.0,
    period: 0.0748,
    parent: "Earth",
  },
  {
    name: "Mars",
    radius: 3.5,
    color: 0xff4500,
    a: 152,
    e: 0.093,
    i: 1.8,
    omega: 49.6,
    w: 286.5,
    M0: 19.4,
    epoch: 2451545.0,
    period: 1.881,
  },
  {
    name: "Jupiter",
    radius: 11,
    color: 0xffa500,
    a: 520,
    e: 0.048,
    i: 1.3,
    omega: 100.5,
    w: 273.9,
    M0: 20.0,
    epoch: 2451545.0,
    period: 11.86,
  },
  {
    name: "Io",
    radius: 2,
    color: 0xffff00,
    a: 30,
    e: 0.0041,
    i: 0.04,
    omega: 43.977,
    w: 84.129,
    M0: 342.021,
    epoch: 2451545.0,
    period: 0.00485,
    parent: "Jupiter",
  },
  {
    name: "Europa",
    radius: 1.8,
    color: 0xa57c1b,
    a: 48,
    e: 0.009,
    i: 0.47,
    omega: 219.106,
    w: 88.97,
    M0: 171.016,
    epoch: 2451545.0,
    period: 0.00972,
    parent: "Jupiter",
  },
  {
    name: "Saturn",
    radius: 9,
    color: 0xffd700,
    a: 953,
    e: 0.054,
    i: 2.5,
    omega: 113.7,
    w: 339.4,
    M0: 317.0,
    epoch: 2451545.0,
    period: 29.46,
  },
  {
    name: "Titan",
    radius: 2.4,
    color: 0xe3dac9,
    a: 80,
    e: 0.0288,
    i: 0.34,
    omega: 28.06,
    w: 180.532,
    M0: 120.589,
    epoch: 2451545.0,
    period: 0.0437,
    parent: "Saturn",
  },
  {
    name: "Uranus",
    radius: 6,
    color: 0x40e0d0,
    a: 1920,
    e: 0.047,
    i: 0.8,
    omega: 74.0,
    w: 96.7,
    M0: 142.2,
    epoch: 2451545.0,
    period: 84.01,
  },
  {
    name: "Neptune",
    radius: 5.8,
    color: 0x4169e1,
    a: 3007,
    e: 0.009,
    i: 1.8,
    omega: 131.7,
    w: 273.2,
    M0: 256.2,
    epoch: 2451545.0,
    period: 164.79,
  },
  {
    name: "Ganymede",
    radius: 2.2,
    color: 0x8b7d82,
    a: 76,
    e: 0.0013,
    i: 0.20,
    omega: 63.552,
    w: 192.417,
    M0: 317.540,
    epoch: 2451545.0,
    period: 0.01962,
    parent: "Jupiter",
  },
  {
    name: "Callisto",
    radius: 2,
    color: 0x7c6a5f,
    a: 134,
    e: 0.0074,
    i: 0.192,
    omega: 298.848,
    w: 52.643,
    M0: 181.408,
    epoch: 2451545.0,
    period: 0.04551,
    parent: "Jupiter",
  },
  {
    name: "Triton",
    radius: 1.8,
    color: 0x8e9ca1,
    a: 30,
    e: 0.0001,
    i: 156.865,
    omega: 61.257,
    w: 83.310,
    M0: 92.762,
    epoch: 2451545.0,
    period: 0.01992,
    parent: "Neptune",
  },
  {
    name: "Rhea",
    radius: 1.2,
    color: 0xd6c2ac,
    a: 44,
    e: 0.001258,
    i: 0.331,
    omega: 249.928,
    w: 77.339,
    M0: 52.123,
    epoch: 2451545.0,
    period: 0.02852,
    parent: "Saturn",
  },
  {
    name: "Iapetus",
    radius: 1.4,
    color: 0x6b4e31,
    a: 240,
    e: 0.028612,
    i: 15.47,
    omega: 117.543,
    w: 227.403,
    M0: 14.275,
    epoch: 2451545.0,
    period: 0.07952,
    parent: "Saturn",
  },
  {
    name: "Phobos",
    radius: 0.8,
    color: 0x8b8378,
    a: 6,
    e: 0.0151,
    i: 1.093,
    omega: 200.193,
    w: 112.091,
    M0: 255.234,
    epoch: 2451545.0,
    period: 0.00031,
    parent: "Mars",
  },
  {
    name: "Deimos",
    radius: 0.6,
    color: 0x6d6050,
    a: 10,
    e: 0.0002,
    i: 0.931,
    omega: 53.202,
    w: 45.235,
    M0: 150.234,
    epoch: 2451545.0,
    period: 0.00126,
    parent: "Mars",
  },
  {
    name: "Oberon",
    radius: 1.4,
    color: 0xa3a4a6,
    a: 60,
    e: 0.0014,
    i: 0.070,
    omega: 95.363,
    w: 10.075,
    M0: 299.872,
    epoch: 2451545.0,
    period: 0.08352,
    parent: "Uranus",
  },
  {
    name: "Titania",
    radius: 1.4,
    color: 0xa7a9a5,
    a: 44,
    e: 0.0011,
    i: 0.340,
    omega: 356.689,
    w: 227.257,
    M0: 149.582,
    epoch: 2451545.0,
    period: 0.05043,
    parent: "Uranus",
  },
  {
    name: "Miranda",
    radius: 1,
    color: 0xbfbfbe,
    a: 14,
    e: 0.0012,
    i: 4.232,
    omega: 69.391,
    w: 98.142,
    M0: 294.231,
    epoch: 2451545.0,
    period: 0.01214,
    parent: "Uranus",
  },
  {
    name: "Dione",
    radius: 1,
    color: 0xc7b8a8,
    a: 32,
    e: 0.0022,
    i: 0.028,
    omega: 321.138,
    w: 302.651,
    M0: 33.928,
    epoch: 2451545.0,
    period: 0.02812,
    parent: "Saturn",
  },
  {
    name: "Ariel",
    radius: 1.2,
    color: 0xbbbdbc,
    a: 20,
    e: 0.0011,
    i: 0.260,
    omega: 134.984,
    w: 124.504,
    M0: 90.413,
    epoch: 2451545.0,
    period: 0.02577,
    parent: "Uranus",
  },
  {
    name: "Enceladus",
    radius: 0.8,
    color: 0xf2f3f4,
    a: 20,
    e: 0.0047,
    i: 0.009,
    omega: 185.978,
    w: 301.450,
    M0: 16.038,
    epoch: 2451545.0,
    period: 0.01296,
    parent: "Saturn",
  },
  {
    name: "Mimas",
    radius: 0.6,
    color: 0xd1ccc9,
    a: 16,
    e: 0.0196,
    i: 1.574,
    omega: 110.393,
    w: 307.979,
    M0: 219.263,
    epoch: 2451545.0,
    period: 0.00985,
    parent: "Saturn",
  },
  {
    name: "Umbriel",
    radius: 1.2,
    color: 0x9b9c98,
    a: 28,
    e: 0.0039,
    i: 0.128,
    omega: 184.143,
    w: 120.897,
    M0: 125.765,
    epoch: 2451545.0,
    period: 0.04642,
    parent: "Uranus",
  },
  {
    name: "Proteus",
    radius: 1,
    color: 0x7d6b67,
    a: 10,
    e: 0.00053,
    i: 0.782,
    omega: 38.165,
    w: 213.326,
    M0: 275.614,
    epoch: 2451545.0,
    period: 0.00109,
    parent: "Neptune",
  },
  {
    name: "Nereid",
    radius: 1.2,
    color: 0x909d98,
    a: 440,
    e: 0.751,
    i: 7.232,
    omega: 324.465,
    w: 23.524,
    M0: 123.984,
    epoch: 2451545.0,
    period: 0.36149,
    parent: "Neptune",
  },
];

export default celestialBodies;