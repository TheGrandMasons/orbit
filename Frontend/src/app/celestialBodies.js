/*
1. The radius is given in kilometers. For some smaller objects, these are estimates.

2. The color is represented as a hexadecimal color code. For many NEOs, the exact color is not known, so I've used estimates based on typical asteroid colors.

3. The /orbital elements are:

  - a: semi-major axis in Astronomical Units (AU)
  - e: eccentricity
  - i: inclination in degrees
  - omega: longitude of the ascending node in degrees
  - w: argument of perihelion in degrees


4. M0 (Mean anomaly) is set to a placeholder value of 180.0 for all objects, as the exact value would depend on a specific time.

5. The epoch is set to J2020 (JD 2459000.5) for consistency.

6. The period is given in years.
*/

const outerSSscale= 2.1;

const celestialBodies = [
  { name: "Sun", radius: 15, color: 0xffff00, mass: 1.989e30, description: 'The Sun is a yellow dwarf star, a hot ball of glowing gases at the heart of our solar system. Its gravity holds everything from the biggest planets to tiny debris in its orbit.' },

  {
    name: "Mercury",
    type: "Planet",
    radius: 3,
    color: 0x8c7853,
    mat: "/assets/M.jpg",
    a: 38.7,
    e: 0.206,
    i: 7.0,
    omega: 48.3,
    w: 29.1,
    M0: 174.8,
    epoch: 2451545.0,
    period: 0.241,
    description: "Mercury—the smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days.",
    LoY: 88, // length of year in Earth days
    moons: 0,
    DoS: 0.39, // distance to the Sun in AU
    rotation_axes: 1
  },

  {
    name: "Venus",
    radius: 4,
    color: 0xffd700,
    mat: "/assets/V.jpg",
    a: 65,
    e: 0.007,
    i: 3.4,
    omega: 76.7,
    w: 54.9,
    M0: 50.4,
    epoch: 2451545.0,
    period: 0.615,
    description: 'Venus spins slowly in the opposite direction from most planets. A thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.',
    LoY: 225,
    moons: 0,
    DoS: 0.72,
    rotation_axes: 1
  },

  {
    name: "Earth",
    radius: 4,
    color: 0x1f9fff,
    mat: "/assets/earth.jpg",
    night: "/assets/earth_night_light.jpg",
    clouds: "/assets/earth_clouds.jpg",
    a: 100,
    e: 0.017,
    i: 0.0,
    omega: 348.7,
    w: 114.2,
    M0: 357.5,
    epoch: 2451545.0,
    period: 1.0,
    description: "Earth—our home planet—is the only place we know of so far that’s inhabited by living things. It's also the only planet in our solar system with liquid water on the surface.",
    LoY: 365,
    moons: 1,
    DoS: 1.0,
    rotation_axes: -23.4
  },

  {
    name: "Moon",
    radius: 1.5,
    color: 0xcccccc,
    mat: "/assets/moon.jpg",
    a: 10,
    e: 0.0549,
    i: 5.145,
    omega: 125.08,
    w: 318.15,
    M0: 135.27,
    epoch: 2451545.0,
    period: 0.0748,
    parent: "Earth",
    description: "Earth's Moon is the only place beyond Earth where humans have set foot, so far. The Moon makes our planet more livable by moderating how much it wobbles on its axis.",
    LoY: 27.3, // length of year in Earth days
    moons: 0,
    DoS: 0.00257, // distance to Earth in AU
    rotation_axes: 1
  },

  {
    name: "Mars",
    radius: 3.5,
    color: 0xff4500,
    mat: "/assets/mars.jpg",
    a: 152,
    e: 0.093,
    i: 1.8,
    omega: 49.6,
    w: 286.5,
    M0: 19.4,
    epoch: 2451545.0,
    period: 1.881,
    description: "Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.",
    LoY: 687,
    moons: 2,
    DoS: 1.52,
    rotation_axes: 1
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
    period: 0.164,  
    parent: "Mars",
    rotation_axes: 1
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
    period: 1.262,  
    parent: "Mars",
    rotation_axes: 1
  },
  {
    name: "Jupiter",
    radius: 11,
    color: 0xffa500,
    mat: "/assets/jupiter.jpg",
    a: 520,
    e: 0.048,
    i: 1.3,
    omega: 100.5,
    w: 273.9,
    M0: 20.0,
    epoch: 2451545.0,
    period: 11.86,
    description: "Jupiter is more than twice as massive than the other planets of our solar system combined. The giant planet's Great Red spot is a centuries-old storm bigger than Earth.",
    LoY: 4333,
    moons: 79,
    DoS: 5.2,
    rotation_axes: 1
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
    period: 1.769,  // Adjusted to the correct orbital period of Io in days
    parent: "Jupiter",
    description: 'Io is the most volcanically active body in the Solar System and one of Jupiter’s moons.',
    LoY: 1.8,
    moons: 0,
    DoS: 0.000249,
    rotation_axes: 1
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
    period: 3.551,  // Adjusted to the correct orbital period of Europa in days
    parent: "Jupiter",
    description: 'Europa is known for its smooth ice-covered surface and is considered a candidate for extraterrestrial life.',
    LoY: 3.5,
    moons: 0,
    DoS: 0.00033,
    rotation_axes: 1
  },
  {
    name: "Ganymede",
    radius: 2.2,
    color: 0x8b7d82,
    a: 76,
    e: 0.0013,
    i: 0.2,
    omega: 63.552,
    w: 192.417,
    M0: 317.54,
    epoch: 2451545.0,
    period: 7.155,  // Adjusted to the correct orbital period of Ganymede in days
    parent: "Jupiter",
    rotation_axes: 1
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
    period: 16.689, // Adjusted to the correct orbital period of Callisto in days
    parent: "Jupiter",
    rotation_axes: 1
  },

  {
    name: "Saturn",
    radius: 9,
    color: 0xffd700,
    mat: "/assets/saturn.jpg",
    ring: true,
    ringMat: "/assets/saturn_ring.png",
    a: 953,
    e: 0.054,
    i: 2.5,
    omega: 113.7,
    w: 339.4,
    M0: 317.0,
    epoch: 2451545.0,
    period: 29.46,
    description: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn's.",
    LoY: 10759,
    moons: 82,
    DoS: 9.58,
    rotation_axes: 6.6
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
    period: 15.95,  // Adjusted to the correct orbital period of Titan in days
    parent: "Saturn",
    description: 'Titan is the largest moon of Saturn and is known for its thick atmosphere and surface lakes of liquid methane.',
    LoY: 15.9,
    moons: 0,
    rotation_axes: 1
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
    period: 4.518,  // Adjusted to the correct orbital period of Rhea in days
    parent: "Saturn",
    rotation_axes: 1
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
    period: 79.32,  // Adjusted to the correct orbital period of Iapetus in days
    parent: "Saturn",
    rotation_axes: 1
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
    period: 2.736,  // Adjusted to the correct orbital period of Dione in days
    parent: "Saturn",
    rotation_axes: 1
},

{
    name: "Enceladus",
    radius: 0.8,
    color: 0xf2f3f4,
    a: 20,
    e: 0.0047,
    i: 0.009,
    omega: 185.978,
    w: 301.45,
    M0: 16.038,
    epoch: 2451545.0,
    period: 1.370,  // Adjusted to the correct orbital period of Enceladus in days
    parent: "Saturn",
    rotation_axes: 1
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
    period: 0.942,  // Adjusted to the correct orbital period of Mimas in days
    parent: "Saturn",
    rotation_axes: 1
},
  {
    name: "Uranus",
    radius: 6,
    color: 0x40e0d0,
    mat: "/assets/uranus.jpg",
    ringMat: "/assets/uranus_ring.png",
    ring: true,
    a: 1920,
    e: 0.047,
    i: 0.8,
    omega: 74.0,
    w: 96.7,
    M0: 142.2,
    epoch: 2451545.0,
    period: 84.01,
    description: "Uranus—seventh planet from the Sun—rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side.",
    LoY: 30687,
    moons: 27,
    DoS: 19.22,
    rotation_axes: 1
  },
  {
    name: "Oberon",
    radius: 1.4,
    color: 0xa3a4a6,
    a: 60,
    e: 0.0014,
    i: 0.07,
    omega: 95.363,
    w: 10.075,
    M0: 299.872,
    epoch: 2451545.0,
    period: 13.46,  // Correct orbital period in days
    parent: "Uranus",
    description: 'Oberon is the second-largest moon of Uranus, known for its heavily cratered surface.',
    rotation_axes: 1
  },
  {
    name: "Titania",
    radius: 1.4,
    color: 0xa7a9a5,
    a: 44,
    e: 0.0011,
    i: 0.34,
    omega: 356.689,
    w: 227.257,
    M0: 149.582,
    epoch: 2451545.0,
    period: 8.71,  // Correct orbital period in days
    parent: "Uranus",
    description: 'Titania is Uranus’ largest moon, with a mix of valleys and fault lines on its surface.',
    rotation_axes: 1
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
    period: 1.41,  // Correct orbital period in days
    parent: "Uranus",
    description: 'Miranda is known for its patchwork of giant fault canyons, terraces, and strange geological features.',
    rotation_axes: 1
  },
  {
    name: "Ariel",
    radius: 1.2,
    color: 0xbbbdbc,
    a: 20,
    e: 0.0011,
    i: 0.26,
    omega: 134.984,
    w: 124.504,
    M0: 90.413,
    epoch: 2451545.0,
    period: 2.52,  // Correct orbital period in days
    parent: "Uranus",
    description: 'Ariel is the brightest and one of the most geologically active moons of Uranus.',
    rotation_axes: 1
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
    period: 4.14,  // Correct orbital period in days
    parent: "Uranus",
    description: 'Umbriel is the darkest moon of Uranus, covered in ancient craters.',
    rotation_axes: 1
  },  
  {
    name: "Neptune",
    radius: 5.8,
    color: 0x4169e1,
    mat: "/assets/neptune.jpg",
    a: 3007,
    e: 0.009,
    i: 1.8,
    omega: 131.7,
    w: 273.2,
    M0: 256.2,
    epoch: 2451545.0,
    period: 164.79,
    description: "Neptune—the eighth and most distant major planet orbiting our Sun—is dark, cold and whipped by supersonic winds. It was the first planet located through mathematical calculations, rather than by telescope.",
    LoY: 60190,
    moons: 14,
    DoS: 30.07,
    rotation_axes: 1
  },
  {
    name: "Triton",
    radius: 1.8,
    color: 0x8e9ca1,
    a: 30,
    e: 0.0001,
    i: 156.865,
    omega: 61.257,
    w: 83.31,
    M0: 92.762,
    epoch: 2451545.0,
    period: 5.876,  // Correct orbital period in days
    parent: "Neptune",
    description: 'Triton is Neptune’s largest moon, known for its retrograde orbit and active geysers.',
    rotation_axes: 1
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
    period: 1.122,  // Correct orbital period in days
    parent: "Neptune",
    description: 'Proteus is the second-largest moon of Neptune and has an irregular shape.',
    rotation_axes: 1
  },
  {
    name: "Nereid",
    radius: 1.2,
    color: 0x909d98,
    a: 245,
    e: 0.751,
    i: 7.232,
    omega: 324.465,
    w: 23.524,
    M0: 123.984,
    epoch: 2451545.0,
    period: 360.136,  // Correct orbital period in days
    parent: "Neptune",
    description: 'Nereid has one of the most eccentric orbits of any moon in the Solar System.',
    rotation_axes: 1

  },
  {
    name: "Naiad",
    radius: 0.5,
    color: 0xaaaaaa,
    a: 6.2,
    e: 0.0002,
    i: 4.74,
    omega: 30.548,
    w: 347.625,
    M0: 59.75,
    epoch: 2451545.0,
    period: 0.294,  // Correct orbital period in days
    parent: "Neptune",
    description: 'Naiad is the innermost of Neptune’s moons and orbits very close to the planet.',
    rotation_axes: 1
  },
  {
    name: "Larissa",
    radius: 1.2,
    color: 0xb0a097,
    a: 18.1,
    e: 0.0014,
    i: 0.205,
    omega: 16.699,
    w: 336.41,
    M0: 190.81,
    epoch: 2451545.0,
    period: 0.555,  // Correct orbital period in days
    parent: "Neptune",
    description: 'Larissa is a small moon of Neptune, discovered by the Voyager 2 spacecraft.',
    rotation_axes: 1
  }  
];

export default celestialBodies;
