// Define star interface based on bright_stars.json structure
export interface Star {
  id: string; 
  mag: number; 
  x: number; 
  y: number; 
  z: number; 
  color: string; 
  atmospheric_color: string; 
  temperature: number; 
  spect: string; 
  ci: string; 
  hip?: number; 
  con?: string; 
  size?: number; 
  dist?: number; 
  ra?: number; 
  dec?: number; 
  lum?: number; 
}

export interface ConstellationData {
  id: string;
  lines: number[][]; 
  common_name?: {
    english?: string;
    native?: string;
    [key: string]: string | undefined; 
  };
  image?: { 
    file: string;
    size?: [number, number];
    anchors?: Array<{ pos: [number, number]; hip: number }>;
  };
}

export interface SkyCultureData {
  id: string;
  constellations?: ConstellationData[];
  asterisms?: AsterismData[]; 
}

export interface AsterismData {
  id: string;
  lines: number[][];
  common_name?: {
    english?: string;
    native?: string;
  };
}

export interface PlanetOrbitalElements {
  name: string;
  semimajor_axis_au?: number; 
  semimajor_axis_km?: number; 
  orbital_eccentricity: number;
  orbital_inclination_degrees: number;
  longitude_of_ascending_node_deg: number;
  argument_of_perihelion_deg: number;
  mean_anomaly_at_epoch_deg: number;
  orbital_period_days: number;
  color?: string;
  magnitude?: number | null; 
}

export interface ReferenceEphemerisEntry {
  id: string;
  name: string;
  distance?: { fromEarth?: { au?: string; km?: string; } };
  position: {
    equatorial: {
      rightAscension: { hours: string; string: string };
      declination: { degrees: string; string: string };
    };
    constellation?: { id: string; short: string; name: string };
  };
  extraInfo?: { magnitude?: number; phase?: { fraction?: string; string?: string } };
}

export interface ReferenceEphemerisData {
  data: {
    table: {
      rows: Array<{ entry: { id: string; name: string }; cells: ReferenceEphemerisEntry[] }>;
    };
  };
}

// Planetary Bodies Data Structure (if specific structure is known for the root JSON)
export interface PlanetaryBodiesFileData {
    epoch_jd: number;
    planets: PlanetOrbitalElements[];
} 