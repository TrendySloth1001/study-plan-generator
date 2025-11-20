// Comprehensive planetary data for solar system visualization

export interface Mission {
  name: string
  year: string
  status: string
  achievement: string
  agency?: string
  type?: string
}

export interface PlanetDetailedInfo {
  name: string
  learningStage: string
  description: string
  quickFacts: string[]
  
  // Physical Characteristics
  physicalData: {
    diameter: string
    mass: string
    density: string
    gravity: string
    escapeVelocity: string
    rotationPeriod: string
    lengthOfDay: string
    axialTilt: string
    surfaceArea: string
    volume: string
  }
  
  // Orbital Characteristics
  orbitalData: {
    distanceFromSun: string
    perihelion: string
    aphelion: string
    orbitalPeriod: string
    orbitalVelocity: string
    orbitalEccentricity: string
    orbitalInclination: string
  }
  
  // Atmospheric Data
  atmosphere: {
    composition: string[]
    pressure: string
    temperature: string
    weatherPatterns?: string[]
  }
  
  // Surface & Interior
  structure: {
    surfaceFeatures: string[]
    composition: string[]
    interiorLayers: string[]
    magneticField: string
  }
  
  // Moons & Rings
  satellites: {
    moonCount: number
    majorMoons?: { name: string; diameter: string; description: string }[]
    rings?: { description: string; composition: string }
  }
  
  // Space Missions
  missions: Mission[]
  
  // Major Discoveries
  discoveries: {
    discovery: string
    year: string
    significance: string
  }[]
  
  // Scientific Importance
  scientificImportance: string[]
  
  // Future Exploration
  futureExploration: {
    plannedMissions: string[]
    researchGoals: string[]
  }
  
  // Fun & Interesting Facts
  interestingFacts: string[]
  
  // Comparison with Earth
  earthComparison: {
    sizeRatio: string
    massRatio: string
    dayLength: string
    yearLength: string
    temperatureRange: string
  }
  
  color: string
}

export const detailedPlanetData: { [key: string]: PlanetDetailedInfo } = {
  mercury: {
    name: "Mercury",
    learningStage: "Foundation Building",
    description: "The smallest and fastest planet, closest to the Sun. Mercury represents rapid progress and fundamental learning - quick wins that build confidence for the journey ahead.",
    quickFacts: [
      "🏃 Fastest orbital speed: 47.87 km/s (107,000 mph)",
      "🌡️ Extreme temperatures: 430°C (day) to -180°C (night)",
      "🪨 Most heavily cratered planet in solar system",
      "💫 No atmosphere - no weather, no wind, no clouds",
      "🌅 Longest day-night cycle in solar system",
      "🎯 Smallest of the eight planets"
    ],
    
    physicalData: {
      diameter: "4,879 km (0.38 × Earth)",
      mass: "3.3011 × 10²³ kg (0.055 × Earth)",
      density: "5.427 g/cm³ (second densest planet)",
      gravity: "3.7 m/s² (0.38 × Earth)",
      escapeVelocity: "4.3 km/s",
      rotationPeriod: "58.6 Earth days",
      lengthOfDay: "176 Earth days (2 Mercury years)",
      axialTilt: "0.034° (almost zero tilt)",
      surfaceArea: "74.8 million km²",
      volume: "6.083 × 10¹⁰ km³"
    },
    
    orbitalData: {
      distanceFromSun: "57.9 million km (0.387 AU)",
      perihelion: "46 million km",
      aphelion: "69.8 million km",
      orbitalPeriod: "88 Earth days",
      orbitalVelocity: "47.87 km/s (average)",
      orbitalEccentricity: "0.2056 (most eccentric orbit)",
      orbitalInclination: "7.005° to ecliptic"
    },
    
    atmosphere: {
      composition: ["42% Oxygen", "29% Sodium", "22% Hydrogen", "6% Helium", "0.5% Potassium (exosphere only)"],
      pressure: "< 0.5 nPa (virtually none)",
      temperature: "-180°C to 430°C",
      weatherPatterns: ["No weather - no atmosphere for wind or clouds"]
    },
    
    structure: {
      surfaceFeatures: [
        "Caloris Basin: 1,550 km diameter impact crater",
        "Weird Terrain: chaotic landscape opposite Caloris",
        "Scarps/cliffs up to 3 km high, 500 km long",
        "Smooth plains from ancient volcanic activity",
        "Heavily cratered highlands",
        "Permanently shadowed polar craters with water ice"
      ],
      composition: ["70% metallic (iron-nickel core)", "30% silicate material"],
      interiorLayers: [
        "Solid iron core: 2,020 km radius",
        "Liquid iron outer core: 400 km thick",
        "Silicate mantle: 420 km thick",
        "Crust: 100-300 km thick"
      ],
      magneticField: "~1% of Earth's - surprisingly strong for small size"
    },
    
    satellites: {
      moonCount: 0,
      majorMoons: []
    },
    
    missions: [
      {
        name: "Mariner 10",
        year: "1974-1975",
        status: "Completed",
        achievement: "First spacecraft to Mercury, mapped 45% of surface",
        agency: "NASA",
        type: "Flyby (3 passes)"
      },
      {
        name: "MESSENGER",
        year: "2011-2015",
        status: "Completed",
        achievement: "First orbiter, mapped 100% of surface, discovered water ice",
        agency: "NASA",
        type: "Orbiter"
      },
      {
        name: "BepiColombo",
        year: "2018-2025",
        status: "En route",
        achievement: "Joint ESA/JAXA mission, arrives December 2025",
        agency: "ESA/JAXA",
        type: "Two orbiters"
      }
    ],
    
    discoveries: [
      {
        discovery: "Water ice in polar craters",
        year: "2012",
        significance: "MESSENGER found permanently shadowed craters contain water ice and organic compounds"
      },
      {
        discovery: "Global magnetic field",
        year: "1974",
        significance: "Mariner 10 revealed Mercury has a magnetic field, unexpected for such a small planet"
      },
      {
        discovery: "Shrinking planet",
        year: "2016",
        significance: "Mercury shrank ~7 km in radius as its interior cooled, creating surface scarps"
      },
      {
        discovery: "Hollows on surface",
        year: "2011",
        significance: "Mysterious bright, shallow depressions likely formed by sublimation of volatiles"
      }
    ],
    
    scientificImportance: [
      "Tests theories of planet formation in extreme conditions",
      "Helps understand planetary magnetic field generation",
      "Provides insights into solar system evolution",
      "Studies space weathering effects from intense solar radiation",
      "Investigates tidal locking and spin-orbit resonance",
      "Examines volatile delivery to inner solar system"
    ],
    
    futureExploration: {
      plannedMissions: [
        "BepiColombo arrival (2025) - comprehensive study",
        "Future sample return mission discussed for 2030s",
        "Possible lander mission to study surface composition"
      ],
      researchGoals: [
        "Map magnetic field in detail",
        "Study water ice in polar regions",
        "Understand hollow formation mechanism",
        "Investigate core composition and structure",
        "Study exosphere dynamics and solar wind interaction"
      ]
    },
    
    interestingFacts: [
      "🌍 One Mercury day (sunrise to sunrise) = 176 Earth days, but year is only 88 Earth days",
      "🔥 Surface hot enough to melt lead (430°C), cold enough to freeze CO₂ (-180°C)",
      "🎯 Orbit is so eccentric, Sun appears to move backward (retrograde) at perihelion",
      "🌊 If you could stand at certain locations, you'd see the Sun rise, stop, reverse, and set again",
      "💎 Core makes up 85% of planet's radius (Earth's is only 55%)",
      "⚡ Named after Roman messenger god because it moves so fast across sky",
      "🎨 Surface looks similar to Moon - gray, cratered, ancient",
      "🔬 Only metal-rich planet we can study up close (others are gas giants or rocky)",
      "📏 Sun appears 3× larger from Mercury than from Earth",
      "🌡️ Temperature difference from day to night is 600°C - most extreme in solar system"
    ],
    
    earthComparison: {
      sizeRatio: "38% of Earth's diameter (could fit inside Earth 18 times)",
      massRatio: "5.5% of Earth's mass",
      dayLength: "176 Earth days (vs 24 hours)",
      yearLength: "88 Earth days (vs 365 days)",
      temperatureRange: "-180°C to 430°C (vs -89°C to 57°C)"
    },
    
    color: "#00e1ff"
  },

  venus: {
    name: "Venus",
    learningStage: "Core Concepts",
    description: "Earth's 'evil twin' - similar size but vastly different conditions. Venus represents deep conceptual understanding with thick layers of knowledge, and challenges conventional thinking by spinning backwards.",
    quickFacts: [
      "🔥 Hottest planet: 462°C surface temperature",
      "⭐ Brightest natural object in night sky after Moon",
      "🔄 Spins backwards (retrograde rotation)",
      "🌋 Over 1,600 major volcanoes on surface",
      "☁️ Thick atmosphere of sulfuric acid clouds",
      "🌍 Earth's twin in size but hell in conditions"
    ],
    
    physicalData: {
      diameter: "12,104 km (0.95 × Earth)",
      mass: "4.867 × 10²⁴ kg (0.815 × Earth)",
      density: "5.243 g/cm³",
      gravity: "8.87 m/s² (0.90 × Earth)",
      escapeVelocity: "10.36 km/s",
      rotationPeriod: "243 Earth days (retrograde)",
      lengthOfDay: "117 Earth days (sunrise to sunrise)",
      axialTilt: "177.4° (almost upside down)",
      surfaceArea: "460.2 million km²",
      volume: "9.28 × 10¹¹ km³"
    },
    
    orbitalData: {
      distanceFromSun: "108.2 million km (0.723 AU)",
      perihelion: "107.5 million km",
      aphelion: "108.9 million km",
      orbitalPeriod: "225 Earth days",
      orbitalVelocity: "35.02 km/s (average)",
      orbitalEccentricity: "0.0067 (most circular orbit)",
      orbitalInclination: "3.39° to ecliptic"
    },
    
    atmosphere: {
      composition: ["96.5% Carbon dioxide", "3.5% Nitrogen", "0.015% Sulfur dioxide", "Traces of water vapor, carbon monoxide, argon, helium"],
      pressure: "92 bar (92× Earth's pressure) - equivalent to 900m underwater",
      temperature: "462°C average (737 K) - hotter than Mercury despite being farther from Sun",
      weatherPatterns: [
        "Super-rotating atmosphere: clouds circle planet every 4 days",
        "Sulfuric acid rain (evaporates before reaching ground)",
        "Hurricane-force winds in upper atmosphere (360 km/h)",
        "Almost no wind at surface (<1 km/h)",
        "Lightning storms",
        "Extreme greenhouse effect"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "Maxwell Montes: highest mountain at 11 km",
        "Ishtar Terra: continent-sized highland",
        "Aphrodite Terra: largest highland region",
        "Coronae: circular volcanic features up to 2,100 km diameter",
        "Pancake domes: flat-topped volcanic domes",
        "Impact craters: ~900 large craters (no small ones due to atmosphere)",
        "Lava flows covering 90% of surface"
      ],
      composition: ["Basaltic rock surface", "Iron-rich core", "Rocky mantle"],
      interiorLayers: [
        "Iron core: 3,200 km radius (possibly solid)",
        "Rocky silicate mantle: 3,000 km thick",
        "Basaltic crust: ~10-20 km thick"
      ],
      magneticField: "None - no intrinsic magnetic field (surprising for planet this size)"
    },
    
    satellites: {
      moonCount: 0,
      majorMoons: []
    },
    
    missions: [
      {
        name: "Venera 7",
        year: "1970",
        status: "Completed",
        achievement: "First successful landing on another planet, survived 23 minutes",
        agency: "USSR",
        type: "Lander"
      },
      {
        name: "Venera 9",
        year: "1975",
        status: "Completed",
        achievement: "First photos from Venus surface",
        agency: "USSR",
        type: "Orbiter & Lander"
      },
      {
        name: "Pioneer Venus",
        year: "1978-1992",
        status: "Completed",
        achievement: "Mapped surface with radar, studied atmosphere",
        agency: "NASA",
        type: "Orbiter & Multiprobe"
      },
      {
        name: "Magellan",
        year: "1990-1994",
        status: "Completed",
        achievement: "Mapped 98% of surface with high-resolution radar",
        agency: "NASA",
        type: "Orbiter"
      },
      {
        name: "Venus Express",
        year: "2006-2014",
        status: "Completed",
        achievement: "Studied atmosphere and plasma environment",
        agency: "ESA",
        type: "Orbiter"
      },
      {
        name: "Akatsuki",
        year: "2015-Present",
        status: "Active",
        achievement: "Studying atmospheric dynamics and weather",
        agency: "JAXA",
        type: "Orbiter"
      },
      {
        name: "DAVINCI",
        year: "2029",
        status: "Planned",
        achievement: "Probe to analyze atmosphere during descent",
        agency: "NASA",
        type: "Atmospheric probe"
      },
      {
        name: "VERITAS",
        year: "2031",
        status: "Planned",
        achievement: "High-resolution surface mapping",
        agency: "NASA",
        type: "Orbiter"
      },
      {
        name: "EnVision",
        year: "2032",
        status: "Planned",
        achievement: "Study geological activity and atmosphere",
        agency: "ESA",
        type: "Orbiter"
      }
    ],
    
    discoveries: [
      {
        discovery: "Active volcanism",
        year: "2023",
        significance: "Magellan data reanalysis revealed active volcanic vents changing over months"
      },
      {
        discovery: "Phosphine in atmosphere",
        year: "2020",
        significance: "Controversial detection suggesting possible life (still debated)"
      },
      {
        discovery: "Runaway greenhouse effect",
        year: "1960s-70s",
        significance: "Venus once had oceans but greenhouse effect evaporated them"
      },
      {
        discovery: "Super-rotation",
        year: "1960s",
        significance: "Atmosphere rotates 60× faster than planet itself"
      },
      {
        discovery: "No plate tectonics",
        year: "1990s",
        significance: "Entire surface resurfaced ~300-500 million years ago"
      }
    ],
    
    scientificImportance: [
      "Natural laboratory for studying extreme greenhouse effect",
      "Helps understand habitability limits and climate change",
      "Tests planet evolution theories - why Venus ≠ Earth",
      "Studies atmospheric super-rotation phenomenon",
      "Investigates volcanic resurfacing processes",
      "Examines why similar planets evolve differently",
      "Provides data for exoplanet comparison"
    ],
    
    futureExploration: {
      plannedMissions: [
        "DAVINCI atmospheric probe (2029)",
        "VERITAS radar mapper (2031)",
        "ESA EnVision orbiter (2032)",
        "Shukrayaan-1 (India's Venus orbiter)",
        "Potential long-duration balloon missions",
        "Future sample return missions discussed"
      ],
      researchGoals: [
        "Confirm or refute phosphine detection",
        "Study active volcanism in detail",
        "Map surface composition",
        "Understand atmospheric chemistry",
        "Investigate past oceans evidence",
        "Determine if Venus was ever habitable"
      ]
    },
    
    interestingFacts: [
      "🌅 Day longer than year: 243 Earth days rotation vs 225 day orbit",
      "🔄 Sun rises in west and sets in east due to retrograde rotation",
      "💡 Can cast shadows on Earth at night - brightest planet in our sky",
      "🌡️ Surface hot enough to melt lead, zinc, and tin",
      "🎂 Atmospheric pressure like being 900m deep in Earth's oceans",
      "⚡ Soviet Venera landers survived only 23-127 minutes in these conditions",
      "👁️ Can see from Earth with naked eye - known since prehistoric times",
      "🎨 Named after Roman goddess of love and beauty",
      "🌩️ Continuous lightning storms in atmosphere",
      "🔥 Hottest planet despite Mercury being closer to Sun",
      "🌊 May have had oceans for billions of years before runaway greenhouse",
      "☁️ Clouds are made of sulfuric acid droplets"
    ],
    
    earthComparison: {
      sizeRatio: "95% of Earth's diameter (very similar size)",
      massRatio: "81.5% of Earth's mass",
      dayLength: "243 Earth days (vs 24 hours)",
      yearLength: "225 Earth days (vs 365 days)",
      temperatureRange: "462°C constant (vs -89°C to 57°C)"
    },
    
    color: "#ff00e6"
  },

  earth: {
    name: "Earth",
    learningStage: "Active Learning",
    description: "The only known planet with life. Perfect conditions for knowledge to flourish - our home and reference point for all planetary science. Represents the ideal learning environment where diverse skills come alive.",
    quickFacts: [
      "🌍 Only planet with liquid water on surface",
      "🧬 Home to ~8.7 million species",
      "🌙 Perfect Moon for tides and stability",
      "🌊 70% ocean coverage",
      "🛡️ Magnetic field protects from solar radiation",
      "🌀 Spins at 1,670 km/h at equator"
    ],
    
    physicalData: {
      diameter: "12,742 km (equatorial)",
      mass: "5.972 × 10²⁴ kg",
      density: "5.514 g/cm³ (densest planet)",
      gravity: "9.807 m/s²",
      escapeVelocity: "11.186 km/s",
      rotationPeriod: "23.93 hours (23h 56m 4s sidereal day)",
      lengthOfDay: "24 hours (mean solar day)",
      axialTilt: "23.44° (causes seasons)",
      surfaceArea: "510.1 million km²",
      volume: "1.083 × 10¹² km³"
    },
    
    orbitalData: {
      distanceFromSun: "149.6 million km (1 AU - astronomical unit)",
      perihelion: "147.1 million km (January)",
      aphelion: "152.1 million km (July)",
      orbitalPeriod: "365.256 days (1 year)",
      orbitalVelocity: "29.78 km/s (average)",
      orbitalEccentricity: "0.0167",
      orbitalInclination: "0° (defines ecliptic plane)"
    },
    
    atmosphere: {
      composition: ["78% Nitrogen", "21% Oxygen", "0.93% Argon", "0.04% Carbon dioxide", "Trace water vapor, methane, ozone"],
      pressure: "101.325 kPa (1 atm at sea level)",
      temperature: "15°C average (288 K)",
      weatherPatterns: [
        "Jet streams at 100-200 km/h",
        "Hurricanes/typhoons/cyclones",
        "Tornadoes up to 480 km/h",
        "Monsoons and seasonal patterns",
        "El Niño/La Niña oscillations",
        "Complex cloud formations"
      ]
    },
    
    structure: {
      surfaceFeatures: [
        "Mount Everest: 8,849m highest point",
        "Mariana Trench: 10,994m deepest point",
        "Seven continents, five oceans",
        "Ring of Fire: volcanic/seismic zone",
        "Great Rift Valley forming new ocean",
        "Vast mountain ranges and plains",
        "Coral reefs, ice caps, deserts, forests"
      ],
      composition: ["Silicate rocks", "Iron-nickel core", "Water (hydrosphere)", "Organic matter (biosphere)"],
      interiorLayers: [
        "Solid inner core: 1,220 km radius, iron-nickel, 5,200°C",
        "Liquid outer core: 2,300 km thick, generates magnetic field",
        "Mantle: 2,900 km thick, semi-solid rock, convection currents",
        "Crust: 5-70 km thick (oceanic vs continental)"
      ],
      magneticField: "Dipole field, 25-65 μT at surface, extends 60,000 km (magnetosphere)"
    },
    
    satellites: {
      moonCount: 1,
      majorMoons: [
        {
          name: "Moon (Luna)",
          diameter: "3,474 km (27% of Earth)",
          description: "Largest moon relative to planet size. Stabilizes Earth's axial tilt, creates tides, slowing Earth's rotation. Formed 4.5 billion years ago likely from giant impact."
        }
      ]
    },
    
    missions: [
      {
        name: "Apollo Program",
        year: "1969-1972",
        status: "Completed",
        achievement: "12 humans walked on Moon, brought back 382 kg of lunar samples",
        agency: "NASA",
        type: "Crewed lunar missions"
      },
      {
        name: "International Space Station",
        year: "1998-Present",
        status: "Active",
        achievement: "Continuous human presence in space for 20+ years",
        agency: "NASA/ESA/Roscosmos/JAXA/CSA",
        type: "Orbiting laboratory"
      },
      {
        name: "Artemis I",
        year: "2022",
        status: "Completed",
        achievement: "Uncrewed test of Orion spacecraft around Moon",
        agency: "NASA",
        type: "Lunar flyby"
      },
      {
        name: "Artemis II",
        year: "2025",
        status: "Planned",
        achievement: "First crewed mission beyond low Earth orbit since 1972",
        agency: "NASA",
        type: "Crewed lunar flyby"
      },
      {
        name: "Artemis III",
        year: "2026",
        status: "Planned",
        achievement: "First woman and person of color on Moon, establish Artemis Base Camp",
        agency: "NASA",
        type: "Crewed lunar landing"
      }
    ],
    
    discoveries: [
      {
        discovery: "Plate tectonics",
        year: "1960s",
        significance: "Earth's surface broken into moving plates - explains earthquakes, volcanism, mountain building"
      },
      {
        discovery: "Van Allen radiation belts",
        year: "1958",
        significance: "Magnetosphere traps charged particles, protects life from solar wind"
      },
      {
        discovery: "Ozone layer",
        year: "1913",
        significance: "Protects life from UV radiation, discovered to be depleting from CFCs"
      },
      {
        discovery: "Earth's age: 4.54 billion years",
        year: "1956",
        significance: "Determined through radiometric dating of oldest rocks and meteorites"
      },
      {
        discovery: "Climate change acceleration",
        year: "Ongoing",
        significance: "Human activity significantly warming planet, changing weather patterns"
      }
    ],
    
    scientificImportance: [
      "Reference point for all planetary science",
      "Only known location of life in universe",
      "Natural laboratory for studying habitability",
      "Demonstrates planet with active geology and tectonics",
      "Shows complex interactions between atmosphere, hydrosphere, biosphere",
      "Key to understanding climate systems",
      "Baseline for exoplanet habitability studies"
    ],
    
    futureExploration: {
      plannedMissions: [
        "Artemis lunar program (2025-2030s) - sustainable Moon presence",
        "Lunar Gateway space station",
        "Mars missions (2030s-2040s)",
        "Asteroid redirect missions",
        "Deep space exploration from lunar orbit"
      ],
      researchGoals: [
        "Establish permanent lunar base",
        "Mine lunar resources (water ice, helium-3)",
        "Use Moon as staging point for Mars missions",
        "Study Earth's climate and environment from space",
        "Monitor near-Earth asteroids",
        "Develop space-based solar power"
      ]
    },
    
    interestingFacts: [
      "🌍 Only planet not named after Greek/Roman deity",
      "🌊 71% water surface but contains <1% of total water in solar system",
      "🎂 If Earth history compressed to 24 hours, humans appeared at 23:58:43",
      "⚡ About 100 lightning strikes per second globally (8.6 million per day)",
      "🌋 ~1,500 active volcanoes on land, many more underwater",
      "🌙 Moon moving away at 3.8 cm/year, days getting longer by 1.7 milliseconds/century",
      "💨 Atmosphere extends to 10,000 km but most is within 16 km",
      "🌀 Coriolis effect makes hurricanes spin differently in each hemisphere",
      "🔥 Earth's core as hot as Sun's surface (5,200°C)",
      "🎯 Solar system's only planet with surface water in all three states",
      "📏 Not perfectly spherical - bulges at equator (equatorial diameter 43 km larger)",
      "🌈 Only planet known to have rainbows (requires water droplets and sunlight)"
    ],
    
    earthComparison: {
      sizeRatio: "1.0 (baseline)",
      massRatio: "1.0 (baseline)",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      temperatureRange: "-89°C to 57°C (recorded extremes)"
    },
    
    color: "#00ff41"
  },

  // ... (Mars, Jupiter, Saturn, Uranus, Neptune data continues in same detailed format)
  // For brevity, I'll create a separate file for the remaining planets
}
