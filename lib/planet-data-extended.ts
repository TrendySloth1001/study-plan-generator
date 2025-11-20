// Extended planetary data for Mars, Jupiter, Saturn, Uranus, Neptune

import { PlanetDetailedInfo } from './planet-data'

export const extendedPlanetData: { [key: string]: PlanetDetailedInfo } = {
  mars: {
    name: "Mars",
    learningStage: "Deep Practice",
    description: "The Red Planet - humanity's next frontier. Mars represents persistent effort through challenging terrain. Like crossing vast deserts and climbing towering mountains, mastery requires dedication through obstacles.",
    quickFacts: [
      "🏔️ Olympus Mons: 21 km tall - tallest volcano (3× Mt. Everest!)",
      "🤖 Currently host to 7 active spacecraft (rovers & orbiters)",
      "❄️ Has polar ice caps made of water and CO₂",
      "🌪️ Massive dust storms can engulf entire planet",
      "🚁 Ingenuity helicopter - first powered flight on another planet",
      "🌅 Sunrises and sunsets appear blue on Mars"
    ],
    
    physicalData: {
      diameter: "6,779 km (0.53 × Earth)",
      mass: "6.417 × 10²³ kg (0.107 × Earth)",
      density: "3.933 g/cm³",
      gravity: "3.72 m/s² (0.38 × Earth)",
      escapeVelocity: "5.03 km/s",
      rotationPeriod: "24.62 hours (24h 37m - very similar to Earth!)",
      lengthOfDay: "24.65 hours (sol)",
      axialTilt: "25.19° (similar to Earth - has seasons)",
      surfaceArea: "144.8 million km²",
      volume: "1.631 × 10¹¹ km³"
    },
    
    orbitalData: {
      distanceFromSun: "227.9 million km (1.524 AU)",
      perihelion: "206.7 million km",
      aphelion: "249.3 million km",
      orbitalPeriod: "687 Earth days (1.88 Earth years)",
      orbitalVelocity: "24.07 km/s (average)",
      orbitalEccentricity: "0.0934 (second most eccentric after Mercury)",
      orbitalInclination: "1.85° to ecliptic"
    },
    
    atmosphere: {
      composition: ["95.3% Carbon dioxide", "2.7% Nitrogen", "1.6% Argon", "0.13% Oxygen", "0.08% Carbon monoxide", "Traces of water vapor, methane"],
      pressure: "0.636 kPa (0.6% of Earth's) - too thin to breathe",
      temperature: "-63°C average (-81°F), ranges -125°C to 20°C",
      weatherPatterns: [
        "Planet-wide dust storms lasting months",
        "Dust devils up to 20 km high",
        "CO₂ frost forming at night",
        "Seasonal dust storms",
        "Morning fog in valleys",
        "Thin clouds of water ice"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "Olympus Mons: 21 km high, 600 km wide (largest volcano in solar system)",
        "Valles Marineris: 4,000 km long canyon system (10× Grand Canyon)",
        "Hellas Planitia: 2,300 km wide, 7 km deep impact basin",
        "Tharsis region: volcanic plateau with 3 giant shield volcanoes",
        "Ancient river valleys and lake beds",
        "Polar ice caps (water ice + CO₂ ice)",
        "Gale Crater, Jezero Crater: former lakebeds explored by rovers"
      ],
      composition: ["Iron oxide-rich surface (gives red color)", "Basaltic rock", "Iron-nickel core", "Silicate mantle"],
      interiorLayers: [
        "Partially molten iron core: 1,800-2,400 km radius",
        "Silicate mantle: 1,300-1,800 km thick",
        "Crust: 50 km average thickness (thicker than Earth's)"
      ],
      magneticField: "No global field - only localized crustal magnetism (remnants from ancient field)"
    },
    
    satellites: {
      moonCount: 2,
      majorMoons: [
        {
          name: "Phobos",
          diameter: "22.2 km (11 × 11 × 9 km - potato shaped)",
          description: "Largest moon, orbits every 7.65 hours - faster than Mars rotates! Destined to crash into Mars in 50 million years. Stickney crater covers much of surface."
        },
        {
          name: "Deimos",
          diameter: "12.6 km (15 × 12 × 11 km)",
          description: "Smaller, smoother moon. Orbits every 30.3 hours. May be captured asteroid. De-orbiting slowly, will escape Mars eventually."
        }
      ]
    },
    
    missions: [
      {
        name: "Viking 1 & 2",
        year: "1976-1982",
        status: "Completed",
        achievement: "First successful Mars landings, searched for life",
        agency: "NASA",
        type: "Orbiters & Landers"
      },
      {
        name: "Mars Pathfinder / Sojourner",
        year: "1997",
        status: "Completed",
        achievement: "First rover on Mars, demonstrated airbag landing",
        agency: "NASA",
        type: "Lander & Rover"
      },
      {
        name: "Spirit & Opportunity",
        year: "2004-2018",
        status: "Completed",
        achievement: "Found evidence of ancient water, Opportunity lasted 14 years (planned 90 days!)",
        agency: "NASA",
        type: "Rovers"
      },
      {
        name: "Curiosity",
        year: "2012-Present",
        status: "Active",
        achievement: "Car-sized rover, found organic molecules, studying Gale Crater",
        agency: "NASA",
        type: "Rover"
      },
      {
        name: "Perseverance & Ingenuity",
        year: "2021-Present",
        status: "Active",
        achievement: "Collecting samples for return, helicopter made 72+ flights",
        agency: "NASA",
        type: "Rover & Helicopter"
      },
      {
        name: "Tianwen-1 & Zhurong",
        year: "2021-2022",
        status: "Orbiter active, rover hibernating",
        achievement: "China's first successful Mars mission",
        agency: "CNSA",
        type: "Orbiter & Rover"
      },
      {
        name: "Mars Sample Return",
        year: "2028-2033",
        status: "Planned",
        achievement: "Return Perseverance's samples to Earth for analysis",
        agency: "NASA/ESA",
        type: "Multi-mission campaign"
      }
    ],
    
    discoveries: [
      {
        discovery: "Ancient rivers and lakes",
        year: "1971-ongoing",
        significance: "Evidence Mars had liquid water on surface billions of years ago"
      },
      {
        discovery: "Subsurface water ice",
        year: "2008-present",
        significance: "Phoenix lander confirmed, later missions found widespread deposits"
      },
      {
        discovery: "Organic molecules",
        year: "2018",
        significance: "Curiosity found complex organics in 3.5 billion year old rocks"
      },
      {
        discovery: "Seasonal methane variations",
        year: "2014",
        significance: "Methane spikes detected - could indicate geological or biological activity"
      },
      {
        discovery: "Subsurface lake",
        year: "2018",
        significance: "Radar detected possible liquid water lake under south polar ice"
      },
      {
        discovery: "Active geology",
        year: "2023",
        significance: "InSight detected marsquakes, revealing active interior"
      }
    ],
    
    scientificImportance: [
      "Most Earth-like planet - best candidate for future human colonization",
      "May have harbored life in past when conditions were warmer and wetter",
      "Natural laboratory for studying climate change (lost most atmosphere)",
      "Demonstrates planetary evolution from habitable to hostile",
      "Tests technology for future human exploration",
      "Helps understand water's role in planetary habitability",
      "Studies dust storm dynamics relevant to Earth deserts"
    ],
    
    futureExploration: {
      plannedMissions: [
        "Mars Sample Return (2028-2033) - bring Perseverance samples to Earth",
        "ExoMars Rosalind Franklin rover (ESA/Roscosmos)",
        "Mars Ice Mapper orbiter - map subsurface ice deposits",
        "First crewed missions (2030s-2040s target)",
        "Mars Base Alpha concept - permanent settlement",
        "SpaceX Starship missions"
      ],
      researchGoals: [
        "Search for past or present microbial life",
        "Analyze returned samples in Earth laboratories",
        "Map water resources for human missions",
        "Understand climate history and atmospheric loss",
        "Develop in-situ resource utilization (ISRU)",
        "Test life support systems for long-duration stays",
        "Establish sustainable human presence"
      ]
    },
    
    interestingFacts: [
      "🌅 Sky is red/orange during day, but sunsets/sunrises are BLUE",
      "📅 Martian day (sol) is 24h 37m - humans could adapt easily",
      "⚖️ You'd weigh 38% of Earth weight - jump 3× higher!",
      "🗓️ Year is 687 Earth days - seasons are twice as long",
      "🌡️ Temperature can swing 100°C between day and night",
      "🚁 Ingenuity helicopter achieved first powered flight on another planet (April 2021)",
      "🏔️ Olympus Mons so tall, you'd be in space at its peak",
      "🌊 Ancient Mars had ocean covering 19% of surface",
      "💨 Wind on Mars feels weaker due to thin atmosphere despite high speeds",
      "🌌 Mars has two tiny moons that look like potatoes",
      "🔴 Red color from iron oxide (rust) covering surface",
      "📡 11-22 minute signal delay to Earth (depending on positions)",
      "🎯 Over 50% of Mars missions have failed (hard target!)",
      "🌀 Dust devils 10× taller than on Earth"
    ],
    
    earthComparison: {
      sizeRatio: "53% of Earth's diameter",
      massRatio: "11% of Earth's mass",
      dayLength: "24.65 hours (24h 37m - very similar!)",
      yearLength: "687 Earth days (1.88 Earth years)",
      temperatureRange: "-125°C to 20°C (vs -89°C to 57°C)"
    },
    
    color: "#ff4444"
  },

  jupiter: {
    name: "Jupiter",
    learningStage: "Advanced Mastery",
    description: "The King of Planets - larger than all others combined. Jupiter represents expertise at massive scale, with complexity swirling in its clouds. Protects inner planets and commands 95 moons like a mentor guiding students.",
    quickFacts: [
      "🌪️ Great Red Spot: 400-year-old storm bigger than Earth",
      "👑 Largest planet - could fit 1,300 Earths inside",
      "🌙 95 confirmed moons (most in solar system with Saturn)",
      "⚡ Lightning bolts 1,000× more powerful than Earth's",
      "🛡️ Protects inner planets from asteroids/comets",
      "💨 Fastest rotation: day is only 10 hours!"
    ],
    
    physicalData: {
      diameter: "139,820 km (11 × Earth)",
      mass: "1.898 × 10²⁷ kg (318 × Earth - 2.5× all other planets combined)",
      density: "1.326 g/cm³ (less than water)",
      gravity: "24.79 m/s² (2.5 × Earth)",
      escapeVelocity: "59.5 km/s",
      rotationPeriod: "9.93 hours (fastest in solar system)",
      lengthOfDay: "9.93 hours",
      axialTilt: "3.13° (minimal seasons)",
      surfaceArea: "61.42 billion km²",
      volume: "1.431 × 10¹⁵ km³"
    },
    
    orbitalData: {
      distanceFromSun: "778.5 million km (5.204 AU)",
      perihelion: "740.5 million km",
      aphelion: "816.6 million km",
      orbitalPeriod: "11.86 Earth years",
      orbitalVelocity: "13.07 km/s (average)",
      orbitalEccentricity: "0.0489",
      orbitalInclination: "1.303° to ecliptic"
    },
    
    atmosphere: {
      composition: ["90% Hydrogen", "10% Helium", "0.3% Methane", "0.026% Ammonia", "0.003% Hydrogen deuteride", "Traces of water, ethane, phosphine"],
      pressure: ">1,000 bar at depth (no solid surface)",
      temperature: "-108°C at cloud tops, 24,000°C at core",
      weatherPatterns: [
        "Great Red Spot: anticyclonic storm 16,000 km wide, winds 430 km/h",
        "Jet streams up to 600 km/h",
        "Lightning strikes 1,000× more powerful than Earth's",
        "Ammonia clouds forming colorful bands",
        "Auroras 1,000× more energetic than Earth's",
        "Cyclone clusters at poles"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "No solid surface - gradual transition to liquid",
        "Colorful cloud bands (zones and belts)",
        "Great Red Spot and other storms",
        "White ovals (smaller storms)",
        "Dark spots appearing and disappearing",
        "Intense auroras at poles"
      ],
      composition: ["90% hydrogen", "10% helium", "Traces of rock/ice", "Possible rocky core"],
      interiorLayers: [
        "Possible rocky core: 10-15 Earth masses, 20,000 km diameter",
        "Metallic hydrogen layer: 40,000 km thick, conducts electricity",
        "Liquid molecular hydrogen: 20,000 km thick",
        "Gaseous atmosphere: 1,000 km visible layer"
      ],
      magneticField: "Strongest in solar system: 20,000× Earth's field, extends 5 million km toward Sun"
    },
    
    satellites: {
      moonCount: 95,
      majorMoons: [
        {
          name: "Io",
          diameter: "3,643 km",
          description: "Most volcanically active body in solar system. 400+ active volcanoes. Sulfur gives yellow-orange color. Lava lakes and 300 km high plumes."
        },
        {
          name: "Europa",
          diameter: "3,122 km",
          description: "Smooth ice surface over global subsurface ocean 100 km deep - twice Earth's water! Best candidate for extraterrestrial life in solar system."
        },
        {
          name: "Ganymede",
          diameter: "5,268 km",
          description: "Largest moon in solar system (bigger than Mercury!). Only moon with own magnetic field. Subsurface ocean. Mix of rock and ice."
        },
        {
          name: "Callisto",
          diameter: "4,821 km",
          description: "Most heavily cratered object in solar system. May have subsurface ocean. Ancient surface 4 billion years old."
        }
      ]
    },
    
    missions: [
      {
        name: "Pioneer 10 & 11",
        year: "1973-1974",
        status: "Completed",
        achievement: "First spacecraft to Jupiter, discovered radiation belts",
        agency: "NASA",
        type: "Flyby"
      },
      {
        name: "Voyager 1 & 2",
        year: "1979",
        status: "Completed (now in interstellar space)",
        achievement: "Discovered Jupiter's rings, detailed moon studies, Great Red Spot",
        agency: "NASA",
        type: "Flyby"
      },
      {
        name: "Galileo",
        year: "1995-2003",
        status: "Completed",
        achievement: "First Jupiter orbiter, studied moons in detail, atmospheric probe",
        agency: "NASA",
        type: "Orbiter & Probe"
      },
      {
        name: "Juno",
        year: "2016-Present",
        status: "Active (extended to 2025)",
        achievement: "Studying Jupiter's interior, magnetic field, auroras, atmosphere",
        agency: "NASA",
        type: "Orbiter"
      },
      {
        name: "Europa Clipper",
        year: "2024-2030",
        status: "En route (launched Oct 2024)",
        achievement: "Will study Europa's ice shell and subsurface ocean",
        agency: "NASA",
        type: "Orbiter (multiple flybys)"
      },
      {
        name: "JUICE",
        year: "2023-2031",
        status: "En route",
        achievement: "Will study Ganymede, Callisto, Europa - first spacecraft to orbit another planet's moon",
        agency: "ESA",
        type: "Orbiter"
      }
    ],
    
    discoveries: [
      {
        discovery: "Europa's subsurface ocean",
        year: "1995-1997",
        significance: "Galileo data revealed global ocean under ice - potential for life"
      },
      {
        discovery: "Jupiter's ring system",
        year: "1979",
        significance: "Voyager 1 discovered faint ring system"
      },
      {
        discovery: "Ganymede's magnetic field",
        year: "1996",
        significance: "First moon discovered with own magnetosphere"
      },
      {
        discovery: "Io's active volcanism",
        year: "1979",
        significance: "Voyager found first active volcanoes beyond Earth"
      },
      {
        discovery: "Water plumes on Europa",
        year: "2013-2018",
        significance: "Hubble detected water vapor plumes - could sample ocean without landing"
      },
      {
        discovery: "Polar cyclone clusters",
        year: "2017",
        significance: "Juno revealed geometric pattern of cyclones at poles"
      }
    ],
    
    scientificImportance: [
      "Dominates solar system dynamics with massive gravity",
      "Protects inner planets from comets/asteroids (cosmic shield)",
      "Europa most promising location for extraterrestrial life",
      "Natural laboratory for studying magnetospheres",
      "Demonstrates planet formation from solar nebula",
      "Studies extreme weather and fluid dynamics",
      "Tests theories of interior structure under extreme pressure"
    ],
    
    futureExploration: {
      plannedMissions: [
        "Europa Clipper (arriving 2030) - detailed Europa study",
        "JUICE (arriving 2031) - focus on Ganymede",
        "Europa Lander concept - drill through ice to ocean",
        "Io volcano observer mission",
        "Atmospheric sample return mission",
        "Future crewed flyby (2060s concept)"
      ],
      researchGoals: [
        "Confirm liquid water on Europa and analyze for life signs",
        "Map Ganymede's subsurface ocean",
        "Study Jupiter's interior structure",
        "Understand moon formation and evolution",
        "Investigate radiation environment",
        "Analyze atmospheric chemistry and dynamics"
      ]
    },
    
    interestingFacts: [
      "👑 If Jupiter were 80× more massive, it would be a star",
      "🌊 Europa's ocean has 2× more water than all Earth's oceans",
      "⚡ Lightning visible from Earth with large telescopes",
      "💨 Fastest rotation creates oblate shape (equator bulges 9,000 km)",
      "🌪️ Great Red Spot shrinking - now 'only' ~16,000 km wide",
      "🎯 Shoemaker-Levy 9 comet hit Jupiter in 1994 - impact sites visible for months",
      "📡 Radio emissions can be heard with amateur radio equipment",
      "🌌 Helped deliver water to early Earth via comet deflections",
      "🔥 Radiates more heat than receives from Sun (still cooling from formation)",
      "🛡️ Without Jupiter, Earth would be hit by asteroids 1,000× more often",
      "🌙 If Ganymede orbited Sun, it would be classified as planet",
      "💎 It may rain diamonds deep in Jupiter's atmosphere"
    ],
    
    earthComparison: {
      sizeRatio: "11× Earth's diameter (1,300 Earths fit inside)",
      massRatio: "318× Earth's mass",
      dayLength: "9.93 hours (vs 24 hours)",
      yearLength: "11.86 Earth years",
      temperatureRange: "-108°C at clouds to 24,000°C at core"
    },
    
    color: "#ffaa00"
  },

  saturn: {
    name: "Saturn",
    learningStage: "Specialization",
    description: "The Ringed Jewel - most beautiful planet. Saturn represents refined expertise with spectacular, organized structure. Its rings demonstrate how individual pieces create stunning systems, like a curriculum perfectly designed.",
    quickFacts: [
      "💍 Spectacular ring system: 280,000 km wide, 10m-1km thick",
      "🎈 Least dense planet - would float in water!",
      "🌙 146 confirmed moons (most in solar system)",
      "🌊 Titan: only moon with thick atmosphere & liquid lakes",
      "🔶 Hexagon storm at north pole - 30,000 km wide",
      "💨 Winds up to 1,800 km/h at equator"
    ],
    
    physicalData: {
      diameter: "116,460 km (9.14 × Earth, without rings)",
      mass: "5.683 × 10²⁶ kg (95 × Earth)",
      density: "0.687 g/cm³ (only planet less dense than water)",
      gravity: "10.44 m/s² (1.06 × Earth at equator)",
      escapeVelocity: "35.5 km/s",
      rotationPeriod: "10.66 hours (at equator)",
      lengthOfDay: "10.66 hours",
      axialTilt: "26.73° (similar to Earth - has seasons)",
      surfaceArea: "42.7 billion km²",
      volume: "8.271 × 10¹⁴ km³"
    },
    
    orbitalData: {
      distanceFromSun: "1.434 billion km (9.582 AU)",
      perihelion: "1.353 billion km",
      aphelion: "1.515 billion km",
      orbitalPeriod: "29.46 Earth years",
      orbitalVelocity: "9.68 km/s (average)",
      orbitalEccentricity: "0.0565",
      orbitalInclination: "2.485° to ecliptic"
    },
    
    atmosphere: {
      composition: ["96.3% Hydrogen", "3.25% Helium", "0.45% Methane", "0.0125% Ammonia", "0.0110% Hydrogen deuteride", "Traces of ethane, phosphine"],
      pressure: ">1,000 bar at depth (no solid surface)",
      temperature: "-178°C at cloud tops, 11,700°C at core",
      weatherPatterns: [
        "Hexagonal polar vortex: 30,000 km wide, 300 km/h winds",
        "Great White Spot: periodic massive storms every 30 years",
        "Jet streams up to 1,800 km/h",
        "Atmospheric bands less distinct than Jupiter",
        "Powerful lightning in storm systems",
        "Auroras at poles"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "No solid surface - gradual transition to liquid",
        "Faint atmospheric bands",
        "North polar hexagon storm",
        "Occasional white spots (large storms)",
        "Southern polar vortex",
        "Stunning ring system visible from space"
      ],
      composition: ["96% hydrogen", "3% helium", "1% heavier elements", "Possible small rocky core"],
      interiorLayers: [
        "Possible rocky core: ~25,000 km diameter (uncertain if exists)",
        "Metallic hydrogen layer: creates magnetic field",
        "Liquid molecular hydrogen and helium",
        "Gaseous atmosphere: ~1,000 km visible layer"
      ],
      magneticField: "578× Earth's field, extends 1 million km"
    },
    
    satellites: {
      moonCount: 146,
      majorMoons: [
        {
          name: "Titan",
          diameter: "5,150 km (2nd largest moon in solar system)",
          description: "Only moon with thick atmosphere (1.5× Earth's pressure!). Liquid methane/ethane lakes and rivers. Orange haze from organic compounds. Most Earth-like body beyond Earth."
        },
        {
          name: "Enceladus",
          diameter: "504 km",
          description: "Ice geysers shoot water 200 km high from subsurface ocean. Smooth ice surface (very young). Potential for microbial life. Supplies material for E ring."
        },
        {
          name: "Mimas",
          diameter: "396 km",
          description: "Death Star moon - giant Herschel crater 1/3 its diameter. Impact nearly destroyed moon. Possible subsurface ocean recently discovered."
        },
        {
          name: "Iapetus",
          diameter: "1,469 km",
          description: "Two-toned moon: one side bright ice, other dark material. Mysterious equatorial ridge 20 km high. Walnut-shaped."
        },
        {
          name: "Rhea",
          diameter: "1,528 km",
          description: "Second largest moon. May have had ring system. Ancient heavily cratered surface."
        }
      ]
    },
    
    missions: [
      {
        name: "Pioneer 11",
        year: "1979",
        status: "Completed",
        achievement: "First spacecraft to Saturn, discovered F ring, studied atmosphere",
        agency: "NASA",
        type: "Flyby"
      },
      {
        name: "Voyager 1 & 2",
        year: "1980-1981",
        status: "Completed",
        achievement: "Detailed ring studies, discovered multiple moons, Titan atmosphere",
        agency: "NASA",
        type: "Flyby"
      },
      {
        name: "Cassini-Huygens",
        year: "2004-2017",
        status: "Completed",
        achievement: "13-year mission! Huygens landed on Titan, discovered Enceladus geysers, studied rings in detail",
        agency: "NASA/ESA/ASI",
        type: "Orbiter & Titan lander"
      },
      {
        name: "Dragonfly",
        year: "2027-2034",
        status: "Planned (launch 2027)",
        achievement: "Nuclear-powered drone to explore Titan's surface and atmosphere",
        agency: "NASA",
        type: "Titan rotorcraft lander"
      }
    ],
    
    discoveries: [
      {
        discovery: "Enceladus water geysers",
        year: "2005",
        significance: "Cassini discovered active water plumes from south pole - subsurface ocean confirmed"
      },
      {
        discovery: "Titan's methane cycle",
        year: "2005-2017",
        significance: "Huygens/Cassini revealed weather system like Earth's but with methane"
      },
      {
        discovery: "Ring composition and dynamics",
        year: "1980-2017",
        significance: "Rings mostly water ice, created from moon destruction, constantly recycling"
      },
      {
        discovery: "Hexagonal polar storm",
        year: "1981",
        significance: "Unique geometric storm pattern never seen elsewhere"
      },
      {
        discovery: "Ring rain",
        year: "2018",
        significance: "Cassini's final data revealed rings raining onto planet - rings may be young"
      },
      {
        discovery: "Mimas subsurface ocean",
        year: "2023",
        significance: "Orbit analysis suggests hidden ocean - unexpected for small moon"
      }
    ],
    
    scientificImportance: [
      "Titan most Earth-like body - methane cycle mimics Earth's water cycle",
      "Enceladus potential for life in subsurface ocean",
      "Ring system demonstrates orbital mechanics and particle dynamics",
      "Natural laboratory for studying atmospheric chemistry",
      "Tests moon formation theories",
      "Studies planetary magnetic fields",
      "Examines organic chemistry on Titan relevant to life's origins"
    ],
    
    futureExploration: {
      plannedMissions: [
        "Dragonfly rotorcraft to Titan (2034 arrival)",
        "Enceladus life finder mission concepts",
        "Titan submarine for methane seas",
        "Ring sample return mission",
        "Saturn atmospheric probe",
        "Multiple moon tour mission concepts"
      ],
      researchGoals: [
        "Search for life in Enceladus ocean",
        "Explore Titan's organic chemistry",
        "Determine ring age and origin",
        "Study interior structure",
        "Map subsurface oceans in multiple moons",
        "Understand hexagon storm mechanism",
        "Sample Titan's atmosphere and lakes"
      ]
    },
    
    interestingFacts: [
      "💍 Rings span 280,000 km but only 10m-1km thick!",
      "🏊 Only planet that could float in water (if you found big enough ocean)",
      "🌙 146 confirmed moons - new ones still being discovered",
      "🔶 Hexagon at north pole contains Earth-sized storm",
      "🌊 Titan has more liquid hydrocarbons than Earth's oil reserves",
      "💨 Fastest winds in solar system: 1,800 km/h",
      "⏱️ Day length still uncertain - magnetic field rotates at different rate than atmosphere",
      "🎯 Rings discovered by Galileo in 1610 (thought they were moons)",
      "💎 Rains diamonds in upper atmosphere (carbon compressed)",
      "🌌 Rings visible from Earth with small telescope",
      "🔥 Radiates 2.5× more heat than receives from Sun",
      "🚀 Cassini deliberately crashed into Saturn to avoid contaminating moons"
    ],
    
    earthComparison: {
      sizeRatio: "9.14× Earth's diameter (760 Earths fit inside)",
      massRatio: "95× Earth's mass",
      dayLength: "10.66 hours (vs 24 hours)",
      yearLength: "29.46 Earth years",
      temperatureRange: "-178°C at clouds to 11,700°C at core"
    },
    
    color: "#ffea00"
  },

  uranus: {
    name: "Uranus",
    learningStage: "Innovation & Creativity",
    description: "The Sideways Planet - rotates on its side at 98°. Uranus represents thinking differently, approaching problems from unique angles. Challenges convention with its bizarre axial tilt and cold methane atmosphere.",
    quickFacts: [
      "🔄 Rotates on its side - 98° axial tilt!",
      "❄️ Coldest planetary atmosphere: -224°C",
      "💎 Rains diamonds in atmosphere",
      "💙 Blue-green color from methane clouds",
      "🌙 27 known moons (all named after Shakespeare/Pope characters)",
      "💍 13 faint ring systems"
    ],
    
    physicalData: {
      diameter: "50,724 km (4 × Earth)",
      mass: "8.681 × 10²⁵ kg (14.5 × Earth)",
      density: "1.271 g/cm³",
      gravity: "8.69 m/s² (0.89 × Earth)",
      escapeVelocity: "21.3 km/s",
      rotationPeriod: "17.24 hours (retrograde on its side)",
      lengthOfDay: "17.24 hours",
      axialTilt: "97.77° (rotates on its side!)",
      surfaceArea: "8.083 billion km²",
      volume: "6.833 × 10¹³ km³"
    },
    
    orbitalData: {
      distanceFromSun: "2.871 billion km (19.19 AU)",
      perihelion: "2.742 billion km",
      aphelion: "3.001 billion km",
      orbitalPeriod: "84 Earth years",
      orbitalVelocity: "6.80 km/s (average)",
      orbitalEccentricity: "0.0457",
      orbitalInclination: "0.773° to ecliptic"
    },
    
    atmosphere: {
      composition: ["82.5% Hydrogen", "15.2% Helium", "2.3% Methane (gives blue color)", "Traces of hydrogen deuteride, ammonia"],
      pressure: ">1,000 bar at depth",
      temperature: "-224°C at cloud tops (coldest in solar system), 5,000°C at core",
      weatherPatterns: [
        "Extreme seasons: 42-year-long summers and winters at poles",
        "Dark spots appear and disappear",
        "Winds up to 900 km/h",
        "Relatively calm atmosphere compared to other giants",
        "Auroras at unusual angles due to tilt",
        "Diamond rain in mantle region"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "No solid surface - gradual transition",
        "Blue-green color from methane",
        "Faint atmospheric bands",
        "Occasional dark spots (storms)",
        "13 narrow ring systems",
        "Unusual magnetic field (60° off rotation axis)"
      ],
      composition: ["80% hydrogen/helium", "20% ices (water, methane, ammonia)", "Possible rocky core"],
      interiorLayers: [
        "Possible rocky-iron core: 9,000 km diameter",
        "Icy mantle: water, methane, ammonia 'ices' (actually hot dense fluids)",
        "Gaseous hydrogen-helium atmosphere",
        "No distinct boundaries between layers"
      ],
      magneticField: "50× Earth's field but highly irregular - 60° off axis, off-center"
    },
    
    satellites: {
      moonCount: 27,
      majorMoons: [
        {
          name: "Titania",
          diameter: "1,578 km (largest Uranian moon)",
          description: "Heavily cratered, huge canyons from past expansion. Mix of ice and rock. Possible subsurface ocean."
        },
        {
          name: "Oberon",
          diameter: "1,523 km",
          description: "Ancient heavily cratered surface. Mysterious dark material on crater floors. May have subsurface ocean."
        },
        {
          name: "Umbriel",
          diameter: "1,169 km",
          description: "Darkest Uranian moon. Ancient cratered surface. Mysterious bright ring called Wunda."
        },
        {
          name: "Ariel",
          diameter: "1,158 km",
          description: "Brightest surface. Youngest geology with valleys and ridges. Evidence of past geological activity."
        },
        {
          name: "Miranda",
          diameter: "472 km",
          description: "Frankenstein moon - patchwork surface suggests catastrophic breakup and reassembly. Verona Rupes cliff: 20 km high (10× Grand Canyon depth)!"
        }
      ]
    },
    
    missions: [
      {
        name: "Voyager 2",
        year: "1986",
        status: "Completed (only spacecraft to visit)",
        achievement: "Discovered 10 moons, studied rings, measured magnetic field, imaged moons",
        agency: "NASA",
        type: "Flyby"
      },
      {
        name: "Uranus Orbiter and Probe",
        year: "2030s-2040s",
        status: "Proposed (high priority)",
        achievement: "Would be first dedicated Uranus mission",
        agency: "NASA",
        type: "Orbiter & atmospheric probe"
      }
    ],
    
    discoveries: [
      {
        discovery: "Extreme axial tilt",
        year: "1986",
        significance: "Voyager 2 confirmed 98° tilt - likely from giant impact"
      },
      {
        discovery: "11 new moons",
        year: "1986",
        significance: "Voyager 2 found moons between visits, bringing total from 5 to 15"
      },
      {
        discovery: "Unusual magnetic field",
        year: "1986",
        significance: "Tilted 60° from rotation axis, offset from center"
      },
      {
        discovery: "Dark rings",
        year: "1977-1986",
        significance: "13 narrow dark rings discovered (opposite of Saturn's bright rings)"
      },
      {
        discovery: "Auroras",
        year: "2011",
        significance: "Hubble detected auroras at unusual angles due to tilted field"
      },
      {
        discovery: "Diamond rain",
        year: "2017",
        significance: "Lab experiments confirmed diamonds form in ice giant interiors"
      }
    ],
    
    scientificImportance: [
      "Only planet knocked on its side - studies giant impact effects",
      "Ice giant composition different from gas giants",
      "Unusual magnetic field challenges dynamo theory",
      "Extreme seasonal variations for 84-year orbit",
      "Miranda's surface provides clues to moon formation",
      "Helps understand ice giant formation and evolution",
      "Relevant to many exoplanets which are ice giants"
    ],
    
    futureExploration: {
      plannedMissions: [
        "Uranus Orbiter and Probe (2030s launch target) - top priority",
        "Atmospheric entry probe",
        "Moon lander missions",
        "Sample return from rings or moons"
      ],
      researchGoals: [
        "Understand why planet is sideways",
        "Study unusual magnetic field",
        "Map interior structure",
        "Investigate moon subsurface oceans",
        "Analyze atmospheric composition and dynamics",
        "Study ring system origin",
        "Determine if moons have life-supporting conditions"
      ]
    },
    
    interestingFacts: [
      "🔄 Only planet that rotates on its side - poles face Sun for 42 years!",
      "❄️ Coldest planet despite not being farthest from Sun",
      "👑 First planet discovered with telescope (William Herschel, 1781)",
      "💎 Rains diamonds - carbon compressed by extreme pressure",
      "🎭 All 27 moons named after Shakespeare and Pope characters",
      "🌊 'Ice giant' not 'gas giant' - different internal composition",
      "💙 Color from methane absorbing red light",
      "🏔️ Miranda's Verona Rupes: tallest cliff in solar system (20 km)",
      "🧲 Magnetic field flips every 17 hours as planet rotates",
      "☀️ Sun looks like bright star from Uranus (1/400th brightness)",
      "🔭 Barely visible from Earth without telescope",
      "💥 Giant impact likely knocked it sideways early in history",
      "🌡️ Oddly doesn't radiate much heat unlike other giants"
    ],
    
    earthComparison: {
      sizeRatio: "4× Earth's diameter (63 Earths fit inside)",
      massRatio: "14.5× Earth's mass",
      dayLength: "17.24 hours (vs 24 hours)",
      yearLength: "84 Earth years",
      temperatureRange: "-224°C at clouds to 5,000°C at core"
    },
    
    color: "#00ffff"
  },

  neptune: {
    name: "Neptune",
    learningStage: "Thought Leadership",
    description: "The Windiest Planet - farthest from the Sun yet most active atmosphere. Neptune represents mastery at the edge of the known, with supersonic winds and dark storms. Leadership in the unexplored frontiers of knowledge.",
    quickFacts: [
      "💨 Fastest winds in solar system: 2,100 km/h (supersonic!)",
      "🔵 Deep blue color from methane atmosphere",
      "🌪️ Great Dark Spot storms appear and disappear",
      "🌙 Triton: only large moon with retrograde orbit",
      "❄️ Coldest major moon - liquid nitrogen geysers",
      "🔭 Discovered by mathematics before observation!"
    ],
    
    physicalData: {
      diameter: "49,244 km (3.88 × Earth)",
      mass: "1.024 × 10²⁶ kg (17.1 × Earth)",
      density: "1.638 g/cm³ (densest giant planet)",
      gravity: "11.15 m/s² (1.14 × Earth)",
      escapeVelocity: "23.5 km/s",
      rotationPeriod: "16.11 hours",
      lengthOfDay: "16.11 hours",
      axialTilt: "28.32° (similar to Earth)",
      surfaceArea: "7.618 billion km²",
      volume: "6.254 × 10¹³ km³"
    },
    
    orbitalData: {
      distanceFromSun: "4.495 billion km (30.07 AU)",
      perihelion: "4.460 billion km",
      aphelion: "4.537 billion km",
      orbitalPeriod: "164.8 Earth years (hasn't completed full orbit since discovery!)",
      orbitalVelocity: "5.43 km/s (average)",
      orbitalEccentricity: "0.0113",
      orbitalInclination: "1.767° to ecliptic"
    },
    
    atmosphere: {
      composition: ["80% Hydrogen", "19% Helium", "1.5% Methane (gives blue color)", "Traces of hydrogen deuteride, ethane, ammonia"],
      pressure: ">1,000 bar at depth",
      temperature: "-214°C at cloud tops, 5,100°C at core",
      weatherPatterns: [
        "Fastest winds: up to 2,100 km/h (supersonic at high altitudes)",
        "Great Dark Spot: Earth-sized storm (comes and goes)",
        "Scooter: small white cloud moving fast",
        "Dark Spot 2: southern hemisphere storm",
        "More atmospheric activity than Uranus despite receiving less solar energy",
        "Auroras at poles"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "No solid surface - gradual transition",
        "Deep blue color from methane",
        "Large dark storms (intermittent)",
        "White methane ice clouds",
        "High-altitude cirrus-like clouds",
        "5 faint ring systems"
      ],
      composition: ["Hydrogen and helium atmosphere", "Water, methane, ammonia ices", "Possible rocky core"],
      interiorLayers: [
        "Rocky-iron core: 1.2 Earth masses, ~8,000 km diameter",
        "Icy mantle: 'hot ice' water-ammonia-methane, 10× Earth's mass",
        "Atmosphere: hydrogen, helium, methane",
        "More distinct layers than Uranus"
      ],
      magneticField: "27× Earth's field, tilted 47° from rotation axis, offset from center"
    },
    
    satellites: {
      moonCount: 16,
      majorMoons: [
        {
          name: "Triton",
          diameter: "2,707 km (7th largest moon in solar system)",
          description: "Only large moon with retrograde orbit - captured Kuiper Belt object! Coldest measured surface in solar system (-235°C). Active nitrogen geysers. Cantaloupe terrain. Destined to be torn apart by Neptune's tides in 3.6 billion years."
        },
        {
          name: "Proteus",
          diameter: "420 km (irregular shape)",
          description: "Second largest moon. Dark surface. Heavily cratered. Nearly large enough to be round but not quite."
        },
        {
          name: "Nereid",
          diameter: "340 km",
          description: "Highly eccentric orbit (wildest orbit of any moon). Takes 360 days to orbit Neptune. Likely captured object."
        },
        {
          name: "Larissa",
          diameter: "194 km",
          description: "Heavily cratered. Orbits within Neptune's ring system."
        }
      ]
    },
    
    missions: [
      {
        name: "Voyager 2",
        year: "1989",
        status: "Completed (only spacecraft to visit)",
        achievement: "Discovered 6 moons, confirmed rings, found Great Dark Spot, studied Triton in detail",
        agency: "NASA",
        type: "Flyby"
      },
      {
        name: "Neptune Odyssey",
        year: "2030s",
        status: "Proposed",
        achievement: "Would study Neptune and Triton in detail",
        agency: "NASA (concept)",
        type: "Orbiter"
      },
      {
        name: "Trident",
        year: "2030s",
        status: "Proposed",
        achievement: "Focused Triton flyby mission",
        agency: "NASA (concept)",
        type: "Flyby"
      }
    ],
    
    discoveries: [
      {
        discovery: "Great Dark Spot",
        year: "1989",
        significance: "Voyager 2 found Earth-sized storm - disappeared by 1994"
      },
      {
        discovery: "Triton's geysers",
        year: "1989",
        significance: "Active nitrogen geysers on coldest surface in solar system - unexpected"
      },
      {
        discovery: "Ring arcs",
        year: "1989",
        significance: "Unusual partial ring arcs (not complete rings)"
      },
      {
        discovery: "Supersonic winds",
        year: "1989",
        significance: "Fastest winds in solar system despite being so far from Sun"
      },
      {
        discovery: "Internal heat source",
        year: "1989",
        significance: "Radiates 2.6× more heat than receives - drives extreme weather"
      },
      {
        discovery: "New dark spot",
        year: "2018",
        significance: "Hubble discovered new Great Dark Spot - storms come and go"
      }
    ],
    
    scientificImportance: [
      "Most active ice giant despite distance from Sun",
      "Triton's retrograde orbit suggests capture from Kuiper Belt",
      "Studies extreme atmospheric dynamics",
      "Internal heat source mystery",
      "Unusual magnetic field challenges models",
      "Triton may have subsurface ocean - potential for life",
      "Relevant to understanding common ice giant exoplanets"
    ],
    
    futureExploration: {
      plannedMissions: [
        "Neptune Odyssey or similar orbiter (2030s proposed)",
        "Trident Triton flyby mission",
        "Atmospheric probe",
        "Triton lander to study geysers and subsurface ocean"
      ],
      researchGoals: [
        "Study Triton's subsurface ocean and potential for life",
        "Understand extreme wind speeds and internal heat",
        "Map interior structure",
        "Analyze atmospheric composition and weather",
        "Study Triton's geysers and surface composition",
        "Investigate ring system dynamics",
        "Determine moon system evolution"
      ]
    },
    
    interestingFacts: [
      "🔭 Discovered by mathematics - Adams and Le Verrier calculated position from Uranus' orbit perturbations",
      "💨 Winds move at 2,100 km/h - five times Earth's hurricane speeds!",
      "❄️ Triton coldest measured surface: -235°C",
      "🌊 Triton may have subsurface ocean of liquid water-ammonia",
      "🔵 Deeper blue than Uranus despite similar methane content",
      "⚡ Diamond rain like Uranus - carbon compressed to crystals",
      "🌙 Triton moving closer - will be shredded into ring in 3.6 billion years",
      "🔥 Radiates 2.6× more heat than receives from Sun",
      "🎯 Sun looks like very bright star from Neptune (1/900th brightness from Earth)",
      "📅 Hasn't completed one full orbit since discovery in 1846!",
      "🌪️ Great Dark Spot was size of Earth but disappeared by 1994",
      "💥 Triton's capture likely ejected other moons and disrupted Neptune system",
      "🎨 Named after Roman god of the sea",
      "🌌 Most distant major planet (sorry Pluto)"
    ],
    
    earthComparison: {
      sizeRatio: "3.88× Earth's diameter (57 Earths fit inside)",
      massRatio: "17.1× Earth's mass",
      dayLength: "16.11 hours (vs 24 hours)",
      yearLength: "164.8 Earth years",
      temperatureRange: "-214°C at clouds to 5,100°C at core"
    },
    
    color: "#4444ff"
  }
}
