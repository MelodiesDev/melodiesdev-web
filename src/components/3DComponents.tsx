"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
  Quaternion,
  Euler,
  TextureLoader,
} from "three";
import { CameraControls, Text, Billboard } from "@react-three/drei";
import brightStarsJson from "@/data/bright_stars.json";
import allConstellationsJson from "@/data/constellations.json";
import referenceEphemerisJson from "@/data/reference_ephemeris_20250520.json"; // New reference data
import planetaryBodiesData from "@/data/planetary_bodies.json"; // Use the augmented one
import * as THREE from 'three';

// DatePicker related imports are removed.

// Define star interface based on bright_stars.json structure
interface Star {
  id: string; // Name of the star (e.g., "Sol", "Sirius")
  mag: number; // Magnitude (visual brightness, lower is brighter)
  x: number; // Cartesian x (often for nearby stars or as fallback)
  y: number; // Cartesian y
  z: number; // Cartesian z
  color: string; // Intrinsic color
  atmospheric_color: string; // Color as seen through atmosphere
  temperature: number; // Kelvin
  spect: string; // Spectral type
  ci: string; // Color Index
  hip?: number; // Hipparcos ID
  con?: string; // Constellation abbreviation
  size?: number; // Physical size (solar radii or similar)
  dist?: number; // Distance (often in light-years or parsecs)
  ra?: number; // Right Ascension (hours, 0-24)
  dec?: number; // Declination (degrees, -90 to +90)
  lum?: number; // Luminosity (relative to Sol)
}

interface ConstellationData {
  id: string;
  lines: number[][]; // Array of arrays, each inner array is a sequence of HIP IDs forming a polyline
  common_name?: {
    english?: string;
    native?: string;
    [key: string]: string | undefined; // Allow other languages
  };
  image?: { // Added image field and its properties
    file: string;
    size?: [number, number];
    anchors?: Array<{ pos: [number, number]; hip: number }>;
  };
}

interface SkyCultureData {
  id: string;
  constellations?: ConstellationData[];
  asterisms?: AsterismData[]; // If you want to add asterisms later
  // other sky culture properties
}

// Simplified Asterism data if you want to use it later
interface AsterismData {
  id: string;
  lines: number[][];
  common_name?: {
    english?: string;
    native?: string;
  };
}

// Updated Planet interface for planetary_bodies.json
interface PlanetOrbitalElements {
  name: string;
  semimajor_axis_au?: number; // Made optional
  semimajor_axis_km?: number; // Added optional km field
  orbital_eccentricity: number;
  orbital_inclination_degrees: number;
  longitude_of_ascending_node_deg: number;
  argument_of_perihelion_deg: number;
  mean_anomaly_at_epoch_deg: number;
  orbital_period_days: number;
  color?: string;
  magnitude?: number | null; // Added magnitude, can be null (e.g. for Earth)
}

// Interfaces for the new reference_ephemeris_20250520.json structure
interface ReferenceEphemerisEntry {
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

interface ReferenceEphemerisData {
  data: {
    table: {
      rows: Array<{ entry: { id: string; name: string }; cells: ReferenceEphemerisEntry[] }>;
    };
  };
}

const parsedReferenceEphemeris = referenceEphemerisJson as ReferenceEphemerisData;
const referenceDateString = "2025-05-20T11:29:08.000+10:00";
const referenceDateEpoch = new Date(referenceDateString).getTime();

// Specific date from user's Stellarium screenshot for Moon position
// const STELLARIUM_IMAGE_DATE_STRING = "2025-05-20T05:45:00.000+10:00"; 
// const stellariumImageDateEpoch = new Date(STELLARIUM_IMAGE_DATE_STRING).getTime();
// const stellariumImageMoonRA = 21.602888; 
// const stellariumImageMoonDec = -17.133416; 

const getReferenceBodyData = (id: string): ReferenceEphemerisEntry | undefined => {
  const row = parsedReferenceEphemeris.data.table.rows.find(r => r.entry.id.toLowerCase() === id.toLowerCase());
  return row?.cells[0]; // Assuming single cell entry for the specific date
};

// Constants
const CELESTIAL_SPHERE_RADIUS = 1500; // Increased radius for better constellation visibility (75 * 20)
const MIN_VISUAL_MAGNITUDE = 7; // Faintest stars to render for points

const tilt = 23.5; // Earths tilt
const earthRadius = 200; // Visual radius for Earth sphere, not actual (10 * 20)
const origin = new Vector3(0, 0, 0);

// Define Sun-related constants after earthRadius is defined
const SUN_SCENE_DISTANCE = CELESTIAL_SPHERE_RADIUS * 0.9; // Distance for the Sun in the scene
const SUN_VISUAL_RADIUS = earthRadius * 0.2; // Visual radius for the Sun in the scene

const AU_KM = 149597870.7; // Astronomical Unit in Kilometers
const J2000_JD = 2451545.0; // Julian Day for J2000.0 epoch from planetary_bodies.json

// Kepler's Equation solver (iterative)
const solveKepler = (meanAnomalyRad: number, eccentricity: number, iterations = 5): number => {
  let eccentricAnomalyRad = meanAnomalyRad; // Initial guess
  for (let i = 0; i < iterations; i++) {
    eccentricAnomalyRad = meanAnomalyRad + eccentricity * Math.sin(eccentricAnomalyRad);
  }
  return eccentricAnomalyRad;
};

// Helper function to calculate planet position
const calculatePlanetHeliocentricEclipticPosition = (
  planet: PlanetOrbitalElements,
  jd: number // Julian Day for the overrideDate
): { x: number; y: number; z: number } => {
  const daysSinceEpoch = jd - J2000_JD;
  const meanMotionRadPerDay = (2 * Math.PI) / planet.orbital_period_days;
  
  const meanAnomalyRad = toRadians(planet.mean_anomaly_at_epoch_deg) + meanMotionRadPerDay * daysSinceEpoch;
  const eccentricity = planet.orbital_eccentricity;
  const eccentricAnomalyRad = solveKepler(meanAnomalyRad, eccentricity);
  
  const trueAnomalyRad = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomalyRad / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomalyRad / 2)
  );
  
  const distanceAU = planet.semimajor_axis_au! * (1 - eccentricity * Math.cos(eccentricAnomalyRad));

  // Position in orbital plane (x towards perihelion)
  const x_orb = distanceAU * Math.cos(trueAnomalyRad);
  const y_orb = distanceAU * Math.sin(trueAnomalyRad);

  // Rotate to heliocentric ecliptic coordinates
  const iRad = toRadians(planet.orbital_inclination_degrees);
  const omegaRad = toRadians(planet.longitude_of_ascending_node_deg); // LAN
  const wRad = toRadians(planet.argument_of_perihelion_deg); // Arg Peri

  const cosOmega = Math.cos(omegaRad);
  const sinOmega = Math.sin(omegaRad);
  const cosW = Math.cos(wRad);
  const sinW = Math.sin(wRad);
  const cosI = Math.cos(iRad);
  const sinI = Math.sin(iRad);

  // Transformation matrix components (PQR vectors)
  const Px = cosW * cosOmega - sinW * sinOmega * cosI;
  const Py = cosW * sinOmega + sinW * cosOmega * cosI;
  const Pz = sinW * sinI;

  const Qx = -sinW * cosOmega - cosW * sinOmega * cosI;
  const Qy = -sinW * sinOmega + cosW * cosOmega * cosI;
  const Qz = cosW * sinI;

  const x_ecl = Px * x_orb + Qx * y_orb;
  const y_ecl = Py * x_orb + Qy * y_orb;
  const z_ecl = Pz * x_orb + Qz * y_orb;
  
  return { x: x_ecl, y: y_ecl, z: z_ecl }; // Heliocentric ecliptic AU
};

// Helper to convert Heliocentric Ecliptic to approximate Geocentric GCRS RA/Dec
// This is a simplification: assumes Sun is at GCRS origin for RA/Dec calculation of planets
// and approximates Ecliptic to Equatorial conversion (ignores full obliquity effect for Dec).
const heliocentricEclipticToApproxRaDec = (
  helioX: number, helioY: number, helioZ: number
): { raHours: number; decDegrees: number } => {
  // For RA, longitude is primary. We are in a right-handed system where +X is vernal equinox.
  // So, atan2(Y, X) gives ecliptic longitude.
  let eclipticLongitudeRad = Math.atan2(helioY, helioX);
  if (eclipticLongitudeRad < 0) eclipticLongitudeRad += 2 * Math.PI;
  const raRad = eclipticLongitudeRad; // Approximate RA as ecliptic longitude for simplicity
  
  // For Dec, latitude is primary. asin(Z / distance)
  const dist = Math.sqrt(helioX*helioX + helioY*helioY + helioZ*helioZ);
  const eclipticLatitudeRad = Math.asin(helioZ / dist);
  
  // Simplistic conversion: approximate Dec as ecliptic latitude (ignores obliquity for this step)
  // A full conversion would be: sin(Dec) = sin(eclipticLat)*cos(obliquity) + cos(eclipticLat)*sin(obliquity)*sin(eclipticLon)
  const decRad = eclipticLatitudeRad;

  const raHours = (raRad * 12) / Math.PI; // Convert radians to hours (0-24)
  const decDegrees = toDegrees(decRad);    // Convert radians to degrees
  
  return { raHours, decDegrees };
};

const toDegrees = (radians: number): number => radians * 180 / Math.PI;

// Helper function to convert RA/Dec to Cartesian coordinates
const raDecToCartesian = (
  raHours: number,
  decDegrees: number,
  radius: number
): [number, number, number] => {
  const raRad = (raHours / 24) * 2 * Math.PI; // Convert RA from hours to radians
  const decRad = (decDegrees * Math.PI) / 180; // Convert Dec from degrees to radians
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [x, y, -z]; // Corrected: Removed negation from x for proper RA orientation
};

// Helper function to convert Lat/Lon to a *local* point on a sphere of given radius
const latLonToLocalPointOnSphere = (
  latitude: number,
  longitude: number,
  radius: number
): [number, number, number] => {
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);

  // Assuming the sphere's local coordinate system has Y-axis pointing North
  const x = radius * Math.cos(latRad) * Math.sin(lonRad); // Using sin(lon) for x
  const y = radius * Math.sin(latRad);                     // Y is now North/South axis
  const z = radius * Math.cos(latRad) * Math.cos(lonRad); // Using cos(lon) for z

  return [x, y, z]; // These are local coordinates on the sphere
};

// Component to render constellation lines
const ConstellationLinesRenderer: FC<{ stars: Star[]; constellationLinesData: ConstellationData[] }> = ({ stars, constellationLinesData }) => {
  const starHipMap = useMemo(() => {
    const map = new Map<number, Vector3>();
    stars.forEach(star => {
      if (star.hip && star.ra !== undefined && star.dec !== undefined) {
        const [x, y, z] = raDecToCartesian(star.ra, star.dec, CELESTIAL_SPHERE_RADIUS);
        map.set(star.hip, new Vector3(x, y, z));
      } else if (star.hip) {
        const dirLength = Math.sqrt(star.x ** 2 + star.y ** 2 + star.z ** 2) || 1;
        const sx = (star.x / dirLength) * CELESTIAL_SPHERE_RADIUS;
        const sy = (star.y / dirLength) * CELESTIAL_SPHERE_RADIUS;
        const sz = (star.z / dirLength) * CELESTIAL_SPHERE_RADIUS;
        map.set(star.hip, new Vector3(sx,sy,sz));
      }
    });
    return map;
  }, [stars]);

  const constellationRenderItems = useMemo(() => {
    const items: { id: string; geometry: BufferGeometry; nameInfo: { name: string; position: Vector3 } }[] = [];

    constellationLinesData.forEach((constellation) => {
      const individualConstellationLinePoints: Vector3[] = [];
      const uniqueStarPositionsForCentroid = new Map<number, Vector3>();

      constellation.lines.forEach((lineSegment: number[]) => {
        // Iterate over the HIPs to form a polyline
        for (let i = 0; i < lineSegment.length - 1; i++) {
          const star1Hip = lineSegment[i];
          const star2Hip = lineSegment[i + 1];
          const star1Pos = starHipMap.get(star1Hip);
          const star2Pos = starHipMap.get(star2Hip);

          if (star1Pos && star2Pos) {
            individualConstellationLinePoints.push(star1Pos.clone(), star2Pos.clone());

            // For centroid calculation, consider each star in the segment
            if (!uniqueStarPositionsForCentroid.has(star1Hip)) {
              uniqueStarPositionsForCentroid.set(star1Hip, star1Pos.clone());
            }
            if (!uniqueStarPositionsForCentroid.has(star2Hip)) {
              uniqueStarPositionsForCentroid.set(star2Hip, star2Pos.clone());
            }
          }
        }
      });

      if (individualConstellationLinePoints.length > 0) {
        const geometry = new BufferGeometry().setFromPoints(individualConstellationLinePoints);
        
        let nameInfo: { name: string, position: Vector3 } | null = null;
        if (uniqueStarPositionsForCentroid.size > 0) {
          const centroid = new Vector3();
          uniqueStarPositionsForCentroid.forEach(p => centroid.add(p));
          centroid.divideScalar(uniqueStarPositionsForCentroid.size);
          nameInfo = {
              name: constellation.common_name?.native || constellation.common_name?.english || constellation.id,
              position: centroid.multiplyScalar(1.05)
          };
        }
        
        if (nameInfo) { 
             items.push({ id: constellation.id, geometry, nameInfo });
        }
      }
    });

    return items;
  }, [starHipMap, constellationLinesData]);

  const lineMaterial = useMemo(() => new LineBasicMaterial({ 
    color: 0x446688, 
    linewidth: 0.5, 
    transparent: true, 
    opacity: 0.5 
  }), []);

  if (constellationRenderItems.length === 0) return null;

  return (
    <group>
      {constellationRenderItems.map((item) => (
        <React.Fragment key={item.id}>
          <lineSegments geometry={item.geometry} material={lineMaterial} />
          {item.nameInfo && (
            <Billboard position={item.nameInfo.position} follow={true}>
              <Text
                fontSize={CELESTIAL_SPHERE_RADIUS / 50}
                color="lightblue"
                anchorX="center"
                anchorY="middle"
                maxWidth={200}
              >
                {item.nameInfo.name}
              </Text>
            </Billboard>
          )}
        </React.Fragment>
      ))}
    </group>
  );
};

// Component to render the star points
const NightSkyRenderer: FC<{ stars: Star[] }> = ({ stars }) => {
  const starFieldRef = useRef<Group>(null);
  const BRIGHT_STAR_LABEL_MAGNITUDE_THRESHOLD = 1.3; // Stars brighter than this will be labeled

  const visibleStars = useMemo(() => {
    return stars.filter(
      (star) => star.id !== 'Sol' && star.mag < MIN_VISUAL_MAGNITUDE // Sol is rendered by SunRenderer
    );
  }, [stars]);

  const starGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const pointSizes: number[] = [];

    visibleStars.forEach((star) => {
      let x: number, y: number, z: number;

      if (star.ra !== undefined && star.dec !== undefined) {
        [x, y, z] = raDecToCartesian(star.ra, star.dec, CELESTIAL_SPHERE_RADIUS);
      } else {
        const dirLength = Math.sqrt(star.x ** 2 + star.y ** 2 + star.z ** 2) || 1;
        x = (star.x / dirLength) * CELESTIAL_SPHERE_RADIUS;
        y = (star.y / dirLength) * CELESTIAL_SPHERE_RADIUS;
        z = (star.z / dirLength) * CELESTIAL_SPHERE_RADIUS;
      }
      positions.push(x, y, z);

      const starColor = new Color(star.atmospheric_color || "#FFFFFF");
      colors.push(starColor.r, starColor.g, starColor.b);

      const visualSize = Math.max(
        0.3, // Minimum visual size
        Math.pow(2.0, -star.mag) * 2.5 // Adjusted scaling for better visibility
      );
      pointSizes.push(visualSize);
    });

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
    geometry.setAttribute("pointSizeAttribute", new BufferAttribute(new Float32Array(pointSizes), 1));

    return geometry;
  }, [visibleStars]);

  const brightStarLabels = useMemo(() => {
    const labels: { id: string; position: Vector3; }[] = [];
    const labeledIds = new Set<string>();
    const sortedBrightStars = visibleStars
      .filter(star => star.mag < BRIGHT_STAR_LABEL_MAGNITUDE_THRESHOLD && star.id)
      .sort((a, b) => a.mag - b.mag);
    
    sortedBrightStars.forEach(star => {
      if (!star.id || labeledIds.has(star.id)) return;
      let x: number, y: number, z: number;
      if (star.ra !== undefined && star.dec !== undefined) {
        [x, y, z] = raDecToCartesian(star.ra, star.dec, CELESTIAL_SPHERE_RADIUS);
      } else {
        const dirLength = Math.sqrt(star.x ** 2 + star.y ** 2 + star.z ** 2) || 1;
        x = (star.x / dirLength) * CELESTIAL_SPHERE_RADIUS;
        y = (star.y / dirLength) * CELESTIAL_SPHERE_RADIUS;
        z = (star.z / dirLength) * CELESTIAL_SPHERE_RADIUS;
      }
      // Slightly offset the label position from the star point
      labels.push({ id: star.id, position: new Vector3(x, y, z).multiplyScalar(1.01) });
      labeledIds.add(star.id);
    });
    return labels;
  }, [visibleStars]);

  const vertexShader = `
    attribute float pointSizeAttribute;
    varying vec3 vColor;
    uniform float uTime;

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float twinkleFactor = 0.7 + 0.3 * rand(vec2(position.x + uTime * 0.015, position.y));
      gl_PointSize = pointSizeAttribute * twinkleFactor * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    uniform float uOpacity;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float strength = 1.0 - smoothstep(0.35, 0.5, dist);
      gl_FragColor = vec4(vColor, strength * uOpacity);
    }
  `;

  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0.0 },
    uOpacity: { value: 0.9 } // Slightly less than 1 for softer look
  }), []);

  useFrame(({ clock }) => {
    shaderUniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group ref={starFieldRef}>
      <points geometry={starGeometry}>
        <shaderMaterial
          uniforms={shaderUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          depthWrite={false}
          transparent
          vertexColors
        />
      </points>
      {brightStarLabels.map((label, index) => (
        <Billboard key={`${label.id}-${index}`} position={label.position} follow={true}>
          <Text
            fontSize={CELESTIAL_SPHERE_RADIUS / 100} // Adjust size as needed
            color="#FFFFCC"
            anchorX="left"
            anchorY="middle"
            material-depthWrite={false} // Ensure text renders correctly with transparent points
          >
            {label.id}
          </Text>
        </Billboard>
      ))}
    </group>
  );
};

// Helper function to convert degrees to radians
const toRadians = (degrees: number): number => degrees * Math.PI / 180;
const arcsecToRadians = (arcsec: number): number => toRadians(arcsec / 3600);

// Component to render the Sun
interface SunRendererProps {
  overrideDate: Date;
  onPositionUpdate?: (position: Vector3) => void; // This prop can be removed if not used
}

const SunRenderer: FC<SunRendererProps> = ({ overrideDate, onPositionUpdate }) => {
  const sunRef = useRef<Group>(null!);

  const sunGCRSVector = useMemo(() => {
    const currentEpoch = overrideDate.getTime();
    let raHours: number | undefined;
    let decDegrees: number | undefined;

    if (Math.abs(currentEpoch - referenceDateEpoch) < 1000) {
      const sunRefData = getReferenceBodyData("sun");
      if (sunRefData) {
        raHours = parseFloat(sunRefData.position.equatorial.rightAscension.hours);
        decDegrees = parseFloat(sunRefData.position.equatorial.declination.degrees);
      }
    }

    if (raHours !== undefined && decDegrees !== undefined) {
      // Use reference data if available for the specific date
      const [x,y,z] = raDecToCartesian(raHours, decDegrees, SUN_SCENE_DISTANCE);
      return new Vector3(x,y,z);
    } else {
      // Fallback to original calculation for other dates
      const now = overrideDate;
      const jd = (now.getTime() / 86400000) + 2440587.5; 
      const t = (jd - 2451545.0) / 36525; 
      const epsilon0_arcsec = 84381.406 - 46.836769 * t - 0.0001831 * t*t + 0.00200340 * t*t*t - 0.000000576 * t*t*t*t - 0.0000000434 * t*t*t*t*t;
      const meanObliquity_rad = arcsecToRadians(epsilon0_arcsec);
      let L_sun_deg = (280.46646 + 36000.76983 * t + 0.0003032 * t * t);
      L_sun_deg = L_sun_deg % 360;
      if (L_sun_deg < 0) L_sun_deg += 360;
      let M_sun_deg = (357.52911 + 35999.05029 * t - 0.0001537 * t * t);
      M_sun_deg = M_sun_deg % 360;
      if (M_sun_deg < 0) M_sun_deg += 360;
      const M_sun_rad = toRadians(M_sun_deg);
      const C_sun_deg = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M_sun_rad) +
                        (0.019993 - 0.000101 * t) * Math.sin(2 * M_sun_rad) +
                        0.000289 * Math.sin(3 * M_sun_rad);
      const lambda_sun_deg = L_sun_deg + C_sun_deg;
      const lambda_sun_rad = toRadians(lambda_sun_deg);
      const X_sun_std = SUN_SCENE_DISTANCE * Math.cos(lambda_sun_rad);
      const Y_sun_std = SUN_SCENE_DISTANCE * Math.sin(lambda_sun_rad) * Math.cos(meanObliquity_rad);
      const Z_sun_std = SUN_SCENE_DISTANCE * Math.sin(lambda_sun_rad) * Math.sin(meanObliquity_rad);
      const finalSunX = X_sun_std;
      const finalSunY = Z_sun_std;
      const finalSunZ = -Y_sun_std;
      return new Vector3(finalSunX, finalSunY, finalSunZ);
    }
  }, [overrideDate]);

  useEffect(() => {
    if (onPositionUpdate) {
      onPositionUpdate(sunGCRSVector);
    }
  }, [sunGCRSVector, onPositionUpdate]);

  return (
    <group ref={sunRef} position={sunGCRSVector}>
      <mesh>
        <sphereGeometry args={[SUN_VISUAL_RADIUS, 32, 32]} />
        <meshStandardMaterial emissive="#FFFF00" emissiveIntensity={2} color="#FFFF00" />
      </mesh>
      <pointLight
        color="#FFFFEE"
        intensity={Math.PI * 150}
        decay={2}
        distance={SUN_SCENE_DISTANCE * 4}
      />
    </group>
  );
};

const AccurateEarth = (props: { overrideDate: Date; children?: React.ReactNode; observerLocation?: GeolocationPosition }) => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const Y_UP_TO_Z_UP = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), []); // This is GCRS_TO_WORLD_FRAME_Q

  useFrame(() => {
    if (!earthRef.current) return;
    const now = props.overrideDate;
    const jd = (now.getTime() / 86400000) + 2440587.5;
    const t = (jd - 2451545.0) / 36525;
    const epsilon0_arcsec = 84381.406 - 46.836769 * t - 0.0001831 * t*t + 0.00200340 * t*t*t - 0.000000576 * t*t*t*t - 0.0000000434 * t*t*t*t*t;
    let meanObliquity_rad = arcsecToRadians(epsilon0_arcsec);
    let nutationInLongitude_rad = arcsecToRadians(0); 
    let nutationInObliquity_rad = arcsecToRadians(0); 
    const trueObliquity_rad = meanObliquity_rad + nutationInObliquity_rad;
    const jd0 = Math.floor(jd - 0.5) + 0.5;
    const daysSinceJ2000_0h = jd0 - 2451545.0;
    const T0 = daysSinceJ2000_0h / 36525;
    let gmst_hours = (6.697374558 + (2400.051336 * T0) + (0.000025862 * T0 * T0));
    const ut_hours = now.getUTCHours() + now.getUTCMinutes()/60 + now.getUTCSeconds()/3600 + now.getUTCMilliseconds()/3600000;
    gmst_hours += ut_hours * 1.00273790935;
    gmst_hours = (gmst_hours % 24 + 24) % 24;
    const gmst_rad = toRadians(gmst_hours * 15);
    const equationOfEquinoxes_rad = nutationInLongitude_rad * Math.cos(trueObliquity_rad);
    const gast_rad = gmst_rad + equationOfEquinoxes_rad;
    const p_zeta_arcsec_T   = (2306.2181 * t + 0.30188 * t*t + 0.017998 * t*t*t);
    const p_z_arcsec_T      = (2306.2181 * t + 1.09468 * t*t + 0.018203 * t*t*t);
    const p_theta_arcsec_T  = (2004.3109 * t - 0.42665 * t*t - 0.041833 * t*t*t);
    const zeta_A_rad  = arcsecToRadians(p_zeta_arcsec_T);
    const z_A_rad     = arcsecToRadians(p_z_arcsec_T);
    const theta_A_rad = arcsecToRadians(p_theta_arcsec_T);
    const Q_P = new THREE.Quaternion();
    const q_z1_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), z_A_rad);
    const q_y_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -theta_A_rad);
    const q_z2_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), zeta_A_rad);
    Q_P.multiplyQuaternions(q_z2_P, q_y_P).multiply(q_z1_P);
    const Q_N = new THREE.Quaternion();
    const Q_N_Rx_mean_obliq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), meanObliquity_rad);
    const Q_N_Rz_delta_psi = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), nutationInLongitude_rad);
    const Q_N_Rx_true_obliq_neg = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -trueObliquity_rad);
    Q_N.multiplyQuaternions(Q_N_Rx_mean_obliq, Q_N_Rz_delta_psi).multiply(Q_N_Rx_true_obliq_neg);
    const Q_PN = new THREE.Quaternion().multiplyQuaternions(Q_N, Q_P);
    const Q_spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), gast_rad); 
    const earthOrientationQ_GCRS = new THREE.Quaternion().multiplyQuaternions(Q_PN, Q_spin);

    // The following block was for camera positioning, which is handled in THREEDComponents useEffect.
    // Earth's mesh orientation should only be GCRS_from_ECEF applied to GCRS_TO_WORLD_FRAME_Q.
    // earthRef.current.quaternion.copy(earthOrientationQ_GCRS); // This would be GCRS orientation
    earthRef.current.quaternion.multiplyQuaternions(Y_UP_TO_Z_UP, earthOrientationQ_GCRS); // Correct: World = World_from_GCRS * GCRS_from_ECEF
    
    // The observerLocation for camera calculations will be handled in the main component's useEffect.
    // The lines below related to observer GCRS pos, up vector, etc. are not needed for Earth's own mesh orientation.
    // They were part of an earlier camera logic that has been centralized.
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[earthRadius, 64, 64]} />
      <meshStandardMaterial color="#2E61A8" wireframe={false} /> {/* Solid Earth */}
      {props.children}
    </mesh>
  );
};

// Component to render the Moon
interface MoonRendererProps { 
  moonTexture: THREE.Texture | null; 
  overrideDate: Date;
}

const MoonRenderer: FC<MoonRendererProps> = ({ moonTexture, overrideDate }) => {
  const moonRef = useRef<THREE.Group>(null!);
  const moonRadius = earthRadius * 0.135; // Adjusted: Halved from 0.27 for smaller visual size
  const moonDataFromPlanetBodies = (planetaryBodiesData.planets.find(p => p.name.toLowerCase() === 'moon')) as PlanetOrbitalElements | undefined;
  
  // Define the target semi-major axis for the Moon in scene units
  const MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS = earthRadius * 5; // Visual scaling for moon's orbit semi-major axis

  const moonPositionECEF = useMemo(() => {
    console.log(`[MoonRenderer V2] Calculating for overrideDate: ${overrideDate.toISOString()}`);
    const overrideJD = (overrideDate.getTime() / 86400000) + 2440587.5;

    if (!moonDataFromPlanetBodies) {
      console.error("[MoonRenderer V2] CRITICAL: Moon orbital elements not found in planetary_bodies.json!");
      return new Vector3(MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS, 0, 0); 
    }

    // 1. Keplerian elements for Moon's orbit around Earth
    const daysSinceEpoch = overrideJD - J2000_JD;
    const meanMotionRadPerDay = (2 * Math.PI) / moonDataFromPlanetBodies.orbital_period_days;
    let meanAnomalyRad = toRadians(moonDataFromPlanetBodies.mean_anomaly_at_epoch_deg) + meanMotionRadPerDay * daysSinceEpoch;
    meanAnomalyRad = meanAnomalyRad % (2 * Math.PI); // Normalize mean anomaly
    if (meanAnomalyRad < 0) meanAnomalyRad += (2 * Math.PI);

    const eccentricity = moonDataFromPlanetBodies.orbital_eccentricity;
    const eccentricAnomalyRad = solveKepler(meanAnomalyRad, eccentricity);
    
    // Ensure trueAnomalyRad is defined once, correctly, before it's needed.
    const trueAnomalyRad = 2 * Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomalyRad / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomalyRad / 2)
    );
    
    // Corrected logic for distanceFromEarthSceneUnits:
    // The term (1 - eccentricity * Math.cos(eccentricAnomalyRad)) is the ratio of current distance to semi-major axis.
    // MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS is the desired semi-major axis IN SCENE UNITS.
    // So, the current distance in scene units is this ratio times the scene's semi-major axis.
    const distanceFromEarthSceneUnits = MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS * (1 - eccentricity * Math.cos(eccentricAnomalyRad));
    console.log(`[MoonRenderer V2] distanceFromEarthSceneUnits (corrected): ${distanceFromEarthSceneUnits}`); // Clarified log

    const x_op = distanceFromEarthSceneUnits * Math.cos(trueAnomalyRad);
    const y_op = distanceFromEarthSceneUnits * Math.sin(trueAnomalyRad);
    console.log(`[MoonRenderer V2] Orbital Plane Coords (x_op, y_op): ${x_op}, ${y_op}`);

    // 2. Transform to Geocentric Ecliptic Coordinates
    const iRad_moon_ecl = toRadians(moonDataFromPlanetBodies.orbital_inclination_degrees);
    const omegaRad_moon_ecl = toRadians(moonDataFromPlanetBodies.longitude_of_ascending_node_deg);
    const wRad_moon_ecl = toRadians(moonDataFromPlanetBodies.argument_of_perihelion_deg);

    const cosOmega_ecl = Math.cos(omegaRad_moon_ecl);
    const sinOmega_ecl = Math.sin(omegaRad_moon_ecl);
    const cosW_ecl = Math.cos(wRad_moon_ecl);
    const sinW_ecl = Math.sin(wRad_moon_ecl);
    const cosI_ecl = Math.cos(iRad_moon_ecl);
    const sinI_ecl = Math.sin(iRad_moon_ecl);

    const Px_ecl = cosW_ecl * cosOmega_ecl - sinW_ecl * sinOmega_ecl * cosI_ecl;
    const Py_ecl = cosW_ecl * sinOmega_ecl + sinW_ecl * cosOmega_ecl * cosI_ecl;
    const Pz_ecl = sinW_ecl * sinI_ecl;
    const Qx_ecl = -sinW_ecl * cosOmega_ecl - cosW_ecl * sinOmega_ecl * cosI_ecl;
    const Qy_ecl = -sinW_ecl * sinOmega_ecl + cosW_ecl * cosOmega_ecl * cosI_ecl;
    const Qz_ecl = cosW_ecl * sinI_ecl;

    const moonEclipticPos = new Vector3(
      Px_ecl * x_op + Qx_ecl * y_op, 
      Py_ecl * x_op + Qy_ecl * y_op, 
      Pz_ecl * x_op + Qz_ecl * y_op  
    );
    console.log("[MoonRenderer V2] Calculated Moon Geocentric Ecliptic Position (X,Y,Z):", moonEclipticPos.x, moonEclipticPos.y, moonEclipticPos.z);

    // 3. Calculate Earth's Mean Obliquity of the Ecliptic (epsilon) for the current date
    const t_obliq = (overrideJD - 2451545.0) / 36525; 
    const epsilon_arcsec = 84381.406 - 46.836769 * t_obliq - 0.0001831 * t_obliq*t_obliq + 0.00200340 * t_obliq*t_obliq*t_obliq - 0.000000576 * t_obliq*t_obliq*t_obliq*t_obliq - 0.0000000434 * t_obliq*t_obliq*t_obliq*t_obliq*t_obliq;
    const meanObliquityRad = arcsecToRadians(epsilon_arcsec);
    const cosEps = Math.cos(meanObliquityRad);
    const sinEps = Math.sin(meanObliquityRad);

    // 4. Transform Geocentric Ecliptic to GCRS (Geocentric Celestial Reference System)
    const moonGCRSPos = new Vector3(
      moonEclipticPos.x,                                          
      moonEclipticPos.y * cosEps - moonEclipticPos.z * sinEps,    
      moonEclipticPos.y * sinEps + moonEclipticPos.z * cosEps     
    );
    console.log("[MoonRenderer V2] Calculated SIMULATED Moon GCRS Position (X,Y,Z):", moonGCRSPos.x, moonGCRSPos.y, moonGCRSPos.z);

    // Always log calculated RA/Dec from GCRS for the current overrideDate
    const R_gcrs_current = moonGCRSPos.length();
    if (R_gcrs_current > 1e-9) {
        let currentSimRaRad = Math.atan2(moonGCRSPos.y, moonGCRSPos.x);
        if (currentSimRaRad < 0) currentSimRaRad += (2 * Math.PI);
        const currentSimDecRad = Math.asin(moonGCRSPos.z / R_gcrs_current);
        const currentSimRA_hours = toDegrees(currentSimRaRad) / 15.0;
        const currentSimDec_degrees = toDegrees(currentSimDecRad);
        console.log(`[MoonRenderer V2] CURRENT Sim GCRS RA/Dec: ${currentSimRA_hours.toFixed(4)}h / ${currentSimDec_degrees.toFixed(4)}° (for date ${overrideDate.toISOString()})`);
    } else {
        console.log(`[MoonRenderer V2] CURRENT Sim GCRS RA/Dec: Undefined (simulated GCRS position is at origin for date ${overrideDate.toISOString()})`);
    }

    // 5. Baseline comparison if overrideDate matches the reference ephemeris date
    if (Math.abs(overrideDate.getTime() - referenceDateEpoch) < 1000) {
      const refMoonData = getReferenceBodyData("moon");
      if (refMoonData?.position?.equatorial) {
        const refRA_hours = parseFloat(refMoonData.position.equatorial.rightAscension.hours);
        const refDec_deg = parseFloat(refMoonData.position.equatorial.declination.degrees);
        console.log(`[MoonRenderer V2] BASELINE CHECK at ${overrideDate.toISOString()}:`);
        console.log(`  Reference RA/Dec: ${refRA_hours.toFixed(4)}h / ${refDec_deg.toFixed(4)}°`);
        
        const R_gcrs = moonGCRSPos.length();
        if (R_gcrs > 1e-9) { // Avoid division by zero if Moon is (erroneously) at Earth's center
            let simulatedRaRad = Math.atan2(moonGCRSPos.y, moonGCRSPos.x); // RA from GCRS X, Y
            if (simulatedRaRad < 0) simulatedRaRad += (2 * Math.PI);
            const simulatedDecRad = Math.asin(moonGCRSPos.z / R_gcrs);   // Dec from GCRS Z
            
            const simulatedRA_hours = toDegrees(simulatedRaRad) / 15.0; // Convert radians to hours
            const simulatedDec_degrees = toDegrees(simulatedDecRad);    // Convert radians to degrees
            console.log(`  Simulated GCRS RA/Dec: ${simulatedRA_hours.toFixed(4)}h / ${simulatedDec_degrees.toFixed(4)}°`);
        } else {
            console.log(`  Simulated GCRS RA/Dec: Undefined (simulated position is at GCRS origin)`);
        }
      } else {
        console.warn("[MoonRenderer V2] Baseline check: Moon data not found in reference ephemeris for comparison.");
      }
    }

    // 6. Transform simulated GCRS Moon position to Earth's local ECEF frame for rendering
    // This uses the same Earth orientation logic (Q_GCRS_from_ECEF) as in AccurateEarth component
    try {
      const now = overrideDate;
      const jd = overrideJD; 
      const t = (jd - 2451545.0) / 36525; // Julian centuries for ECEF transformation elements

      // Earth orientation parameters (Precession, Nutation, Spin) for GCRS <-> ECEF
      // Note: current nutation terms (nutationInLongitude_rad, nutationInObliquity_rad) are zero.
      // Mean obliquity for Q_N is calculated here as meanObliquity_rad_for_ecef_transform
      const epsilon0_arcsec_ecef = 84381.406 - 46.836769 * t - 0.0001831 * t*t + 0.00200340 * t*t*t - 0.000000576 * t*t*t*t - 0.0000000434 * t*t*t*t*t;
      const meanObliquity_rad_for_ecef_transform = arcsecToRadians(epsilon0_arcsec_ecef);
      
      const nutationInLongitude_rad = arcsecToRadians(0); // Placeholder for actual nutation model
      const nutationInObliquity_rad = arcsecToRadians(0); // Placeholder for actual nutation model
      const trueObliquity_rad_for_ecef_transform = meanObliquity_rad_for_ecef_transform + nutationInObliquity_rad;

      // GMST and GAST
      const jd0 = Math.floor(jd - 0.5) + 0.5;
      const daysSinceJ2000_0h = jd0 - 2451545.0;
      const T0 = daysSinceJ2000_0h / 36525;
      let gmst_hours = (6.697374558 + (2400.051336 * T0) + (0.000025862 * T0 * T0));
      const ut_hours = now.getUTCHours() + now.getUTCMinutes()/60 + now.getUTCSeconds()/3600 + now.getUTCMilliseconds()/3600000;
      gmst_hours += ut_hours * 1.00273790935;
      gmst_hours = (gmst_hours % 24 + 24) % 24;
      const gmst_rad = toRadians(gmst_hours * 15);
      const equationOfEquinoxes_rad = nutationInLongitude_rad * Math.cos(trueObliquity_rad_for_ecef_transform);
      const gast_rad = gmst_rad + equationOfEquinoxes_rad;
      
      // Precession angles (zeta_A, z_A, theta_A)
      const p_zeta_arcsec_T   = (2306.2181 * t + 0.30188 * t*t + 0.017998 * t*t*t);
      const p_z_arcsec_T      = (2306.2181 * t + 1.09468 * t*t + 0.018203 * t*t*t);
      const p_theta_arcsec_T  = (2004.3109 * t - 0.42665 * t*t - 0.041833 * t*t*t);
      const zeta_A_rad  = arcsecToRadians(p_zeta_arcsec_T);
      const z_A_rad     = arcsecToRadians(p_z_arcsec_T);
      const theta_A_rad = arcsecToRadians(p_theta_arcsec_T);

      // Precession Quaternion Q_P (from ECEF to Mean Equator and Equinox of Date)
      const Q_P = new THREE.Quaternion();
      const q_z1_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), z_A_rad);
      const q_y_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -theta_A_rad);
      const q_z2_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), zeta_A_rad);
      Q_P.multiplyQuaternions(q_z2_P, q_y_P).multiply(q_z1_P);

      // Nutation Quaternion Q_N (from Mean to True Equator and Equinox of Date)
      const Q_N = new THREE.Quaternion();
      // Rotate by mean obliquity, then nutation in longitude, then by -true obliquity
      const Q_N_Rx_mean_obliq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), meanObliquity_rad_for_ecef_transform);
      const Q_N_Rz_delta_psi = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), nutationInLongitude_rad); 
      const Q_N_Rx_true_obliq_neg = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -trueObliquity_rad_for_ecef_transform);
      Q_N.multiplyQuaternions(Q_N_Rx_mean_obliq, Q_N_Rz_delta_psi).multiply(Q_N_Rx_true_obliq_neg);
      
      // Precession-Nutation Q_PN (from ECEF to True Equator and Equinox of Date)
      const Q_PN = new THREE.Quaternion().multiplyQuaternions(Q_N, Q_P);
      
      // Spin Quaternion Q_spin (Earth rotation, GAST, from True Equator of Date to GCRS)
      const Q_spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), gast_rad); 
      
      // Full GCRS_from_ECEF Quaternion
      const Q_GCRS_from_ECEF = new THREE.Quaternion().multiplyQuaternions(Q_PN, Q_spin);

      // To get ECEF from GCRS, we apply the inverse of Q_GCRS_from_ECEF
      const finalPositionECEF = moonGCRSPos.clone().applyQuaternion(Q_GCRS_from_ECEF.clone().invert());
      console.log("[MoonRenderer V2] Calculated final SIMULATED ECEF Position (X,Y,Z):", finalPositionECEF.x, finalPositionECEF.y, finalPositionECEF.z);

      if (finalPositionECEF.toArray().some(isNaN)) {
          console.error("[MoonRenderer V2] ERROR: Final ECEF position from SIMULATED path contains NaN! Using emergency fallback.");
          return new Vector3(MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS * 0.7, 0, 0); 
      }
      return finalPositionECEF;

    } catch (e) {
      console.error("[MoonRenderer V2] Error during GCRS to ECEF calculation for SIMULATED Moon:", e);
      return new Vector3(MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS * 0.6, 0, 0); 
    }
  }, [overrideDate, moonDataFromPlanetBodies]); 


  useEffect(() => {
    if (moonRef.current) {
        moonRef.current.position.copy(moonPositionECEF);
    }
  }, [moonPositionECEF]);

  console.log("[MoonRenderer V2] moonTexture is loaded:", !!moonTexture); // Log texture status
  if (!moonTexture) return null;

  return (
    <group ref={moonRef}>
      <mesh>
        <sphereGeometry args={[moonRadius, 32, 32]} />
        <meshStandardMaterial map={moonTexture} roughness={0.9} /> {/* Restored original material */}
      </mesh>
    </group>
  );
};

// Component to render planets
const PlanetsRenderer: FC<{ overrideDate: Date }> = ({ overrideDate }) => {
  const planetsToRenderData = useMemo(() => {
    const planetDataForRender: { name: string, position: Vector3, color: Color, id: string, magnitude?: number | null }[] = [];
    const currentEpoch = overrideDate.getTime();
    const overrideJD = (currentEpoch / 86400000) + 2440587.5;
    const isReferenceTime = Math.abs(currentEpoch - referenceDateEpoch) < 1000;

    const sourcePlanets = (planetaryBodiesData as {epoch_jd: number, planets: PlanetOrbitalElements[]}).planets;

    sourcePlanets.forEach(p => {
      if (p.name.toLowerCase() === "earth" || p.name.toLowerCase() === "sun" || p.name.toLowerCase() === "moon") return; // Sun and Moon are handled by their own renderers

      let raHours: number | undefined;
      let decDegrees: number | undefined;
      let name: string = p.name;
      let color = new Color(p.color || 0xffffff);
      const id = p.name.toLowerCase();
      let currentMagnitude: number | null | undefined = p.magnitude;

      if (isReferenceTime) {
        const refData = getReferenceBodyData(id);
        if (refData) {
          raHours = parseFloat(refData.position.equatorial.rightAscension.hours);
          decDegrees = parseFloat(refData.position.equatorial.declination.degrees);
          name = refData.name; 
          if (refData.extraInfo?.magnitude !== undefined) {
            currentMagnitude = refData.extraInfo.magnitude;
          }
        }
      } else {
        const helioEclPos = calculatePlanetHeliocentricEclipticPosition(p, overrideJD);
        const approxRaDec = heliocentricEclipticToApproxRaDec(helioEclPos.x, helioEclPos.y, helioEclPos.z);
        raHours = approxRaDec.raHours;
        decDegrees = approxRaDec.decDegrees;
      }
      
      if (raHours !== undefined && decDegrees !== undefined) {
        const [x, y, z] = raDecToCartesian(raHours, decDegrees, CELESTIAL_SPHERE_RADIUS);
        planetDataForRender.push({ name, position: new Vector3(x, y, z), color, id, magnitude: currentMagnitude });
      } 
    });
    return planetDataForRender;
  }, [overrideDate]);

  const planetPoints = useMemo(() => {
    if (planetsToRenderData.length === 0) return null;
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const pointSizes: number[] = [];
    const MIN_PLANET_POINT_SIZE = 0.3; // Min visual size for faint planets
    const MAG_BASE = 2.0; // Base for magnitude scaling (lower = larger points for same mag)
    const MAG_SCALAR = 2.5; // Multiplier for magnitude effect

    planetsToRenderData.forEach(planet => {
      positions.push(planet.position.x, planet.position.y, planet.position.z);
      colors.push(planet.color.r, planet.color.g, planet.color.b);
      
      let visualSize = MIN_PLANET_POINT_SIZE;
      if (planet.magnitude !== null && planet.magnitude !== undefined) {
        visualSize = Math.max(MIN_PLANET_POINT_SIZE, Math.pow(MAG_BASE, -planet.magnitude) * MAG_SCALAR);
      }
      pointSizes.push(visualSize);
    });

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
    geometry.setAttribute("pointSizeAttribute", new BufferAttribute(new Float32Array(pointSizes), 1));
    return geometry;
  }, [planetsToRenderData]);

  const vertexShader = `
    attribute float pointSizeAttribute;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = pointSizeAttribute * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    uniform float uOpacity;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float strength = 1.0 - smoothstep(0.35, 0.5, dist);
      gl_FragColor = vec4(vColor, strength * uOpacity);
    }
  `;

  const shaderUniforms = useMemo(() => ({
    uOpacity: { value: 0.95 }
  }), []);
  
  if (!planetPoints) return null;

  return (
    <group>
      <points geometry={planetPoints}>
        <shaderMaterial
          uniforms={shaderUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          depthWrite={false}
          transparent
          vertexColors
        />
      </points>
      {planetsToRenderData.map((planet) => (
        <Billboard key={planet.id} position={planet.position.clone().multiplyScalar(1.02)} follow={true}>
          <Text
            fontSize={CELESTIAL_SPHERE_RADIUS / 70}
            color={planet.color.getStyle()}
            anchorX="center"
            anchorY="middle"
            material-depthWrite={false}
          >
            {planet.name}
          </Text>
        </Billboard>
      ))}
    </group>
  );
};

interface THREEDComponentsProps {
  overrideDate: Date;
}

export const THREEDComponents: FC<THREEDComponentsProps> = ({ overrideDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<CameraControls | null>(null); // Initialize as null, type allows null
  const [controlsReady, setControlsReady] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | undefined>();
  const [moonTexture, setMoonTexture] = useState<THREE.Texture | null>(null);

  // Log the overrideDate received by THREEDComponents
  useEffect(() => {
    console.log(`[THREEDComponents] Received overrideDate: ${overrideDate.toISOString()}`);
  }, [overrideDate]);

  const allStars = brightStarsJson as Star[];
  const constellationCultureData = allConstellationsJson as SkyCultureData;

  // Define the GCRS to World Frame transformation quaternion
  const GCRS_TO_WORLD_FRAME_Q = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLocation(position);
    });
    
    // Load moon texture
    const loader = new TextureLoader();
    loader.load('/moon.jpg', (texture: THREE.Texture) => {
      setMoonTexture(texture);
    });

  }, []);

  const camera = useMemo(() => {
    const camInstance = new ThreePerspectiveCamera(
      70,
      typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1,
      0.1,
      CELESTIAL_SPHERE_RADIUS * 5 
    );
    camInstance.position.set(0, earthRadius * 1.5, earthRadius * 1.5); 
    return camInstance;
  }, []);

  // cameraLocalPosition is not strictly needed by the camera orientation effect anymore,
  // but kept if other parts might use its Y-up sphere convention.
  const cameraLocalPosition = useMemo(() => {
    if (!location?.coords) return new Vector3(0, earthRadius, 0); 
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const [x, y, z] = latLonToLocalPointOnSphere(latitude, longitude, earthRadius);
    return new Vector3(x, y, z); 
  }, [location]);


  // This useEffect will orient the camera
  useEffect(() => {
    const effectiveDate = overrideDate;

    const effectiveLatitude = location?.coords?.latitude ?? 0;
    const effectiveLongitude = location?.coords?.longitude ?? 0;

    if (!controlsReady || !controlsRef.current) { // Added !controlsReady check
      return;
    }
    
    const now = effectiveDate; 
    const jd = (now.getTime() / 86400000) + 2440587.5;
    const t = (jd - 2451545.0) / 36525;
    const epsilon0_arcsec = 84381.406 - 46.836769 * t - 0.0001831 * t*t + 0.00200340 * t*t*t - 0.000000576 * t*t*t*t - 0.0000000434 * t*t*t*t*t;
    let meanObliquity_rad = arcsecToRadians(epsilon0_arcsec);
    let nutationInLongitude_rad = arcsecToRadians(0); 
    let nutationInObliquity_rad = arcsecToRadians(0); 
    const trueObliquity_rad = meanObliquity_rad + nutationInObliquity_rad;
    const jd0 = Math.floor(jd - 0.5) + 0.5;
    const daysSinceJ2000_0h = jd0 - 2451545.0;
    const T0 = daysSinceJ2000_0h / 36525;
    let gmst_hours = (6.697374558 + (2400.051336 * T0) + (0.000025862 * T0 * T0));
    const ut_hours = now.getUTCHours() + now.getUTCMinutes()/60 + now.getUTCSeconds()/3600 + now.getUTCMilliseconds()/3600000;
    gmst_hours += ut_hours * 1.00273790935;
    gmst_hours = (gmst_hours % 24 + 24) % 24;
    const gmst_rad = toRadians(gmst_hours * 15);
    const equationOfEquinoxes_rad = nutationInLongitude_rad * Math.cos(trueObliquity_rad);
    const gast_rad = gmst_rad + equationOfEquinoxes_rad;
    const p_zeta_arcsec_T   = (2306.2181 * t + 0.30188 * t*t + 0.017998 * t*t*t);
    const p_z_arcsec_T      = (2306.2181 * t + 1.09468 * t*t + 0.018203 * t*t*t);
    const p_theta_arcsec_T  = (2004.3109 * t - 0.42665 * t*t - 0.041833 * t*t*t);
    const zeta_A_rad  = arcsecToRadians(p_zeta_arcsec_T);
    const z_A_rad     = arcsecToRadians(p_z_arcsec_T);
    const theta_A_rad = arcsecToRadians(p_theta_arcsec_T);
    const Q_P = new THREE.Quaternion();
    const q_z1_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), z_A_rad);
    const q_y_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -theta_A_rad);
    const q_z2_P = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), zeta_A_rad);
    Q_P.multiplyQuaternions(q_z2_P, q_y_P).multiply(q_z1_P);
    const Q_N = new THREE.Quaternion();
    const Q_N_Rx_mean_obliq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), meanObliquity_rad);
    const Q_N_Rz_delta_psi = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), nutationInLongitude_rad);
    const Q_N_Rx_true_obliq_neg = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -trueObliquity_rad);
    Q_N.multiplyQuaternions(Q_N_Rx_mean_obliq, Q_N_Rz_delta_psi).multiply(Q_N_Rx_true_obliq_neg);
    const Q_PN = new THREE.Quaternion().multiplyQuaternions(Q_N, Q_P);
    const Q_spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), gast_rad); 
    const earthOrientationQ_GCRS = new THREE.Quaternion().multiplyQuaternions(Q_PN, Q_spin);

    const latRad = toRadians(effectiveLatitude);
    const lonRad = toRadians(effectiveLongitude);
    const x_fixed = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
    const y_fixed = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
    const z_fixed = earthRadius * Math.sin(latRad);
    const observerECEF = new THREE.Vector3(x_fixed, y_fixed, z_fixed);
    const observerGCRSPos = observerECEF.clone().applyQuaternion(earthOrientationQ_GCRS);

    const observerUpVector_GCRS = observerGCRSPos.clone().normalize(); 
    const cameraElevation = earthRadius * 0.002; 
    const cameraPosition_GCRS = observerGCRSPos.clone().add(observerUpVector_GCRS.clone().multiplyScalar(cameraElevation));

    const sceneCameraPosition = cameraPosition_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    const celestialNorthPole_GCRS = new THREE.Vector3(0, 0, 1);
    let localNorthDir_GCRS = celestialNorthPole_GCRS.clone().sub(observerUpVector_GCRS.clone().multiplyScalar(celestialNorthPole_GCRS.dot(observerUpVector_GCRS)));
    if (localNorthDir_GCRS.lengthSq() < 1e-8) { 
        const refHorizontal_GCRS = new THREE.Vector3(1,0,0);
        localNorthDir_GCRS = refHorizontal_GCRS.clone().sub(observerUpVector_GCRS.clone().multiplyScalar(refHorizontal_GCRS.dot(observerUpVector_GCRS))).normalize();
         if (localNorthDir_GCRS.lengthSq() < 1e-8) { 
            const refHorizontalY_GCRS = new THREE.Vector3(0,1,0);
            localNorthDir_GCRS = refHorizontalY_GCRS.clone().sub(observerUpVector_GCRS.clone().multiplyScalar(refHorizontalY_GCRS.dot(observerUpVector_GCRS))).normalize();
        }
    } else {
        localNorthDir_GCRS.normalize();
    }
    const sceneCameraUp = localNorthDir_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);

    controlsRef.current.camera.up.copy(sceneCameraUp); 

    // Default: Look at Zenith
    console.log("[THREEDComponents] Camera looking at Zenith.");
    const finalLookDir_GCRS = new THREE.Vector3();
    finalLookDir_GCRS.copy(observerUpVector_GCRS);
    const lookAtTarget_GCRS = cameraPosition_GCRS.clone().add(finalLookDir_GCRS.multiplyScalar(CELESTIAL_SPHERE_RADIUS));
    const sceneLookAtTarget = lookAtTarget_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);

    controlsRef.current.setLookAt(
      sceneCameraPosition.x, sceneCameraPosition.y, sceneCameraPosition.z,
      sceneLookAtTarget.x, sceneLookAtTarget.y, sceneLookAtTarget.z,
      true // Enable smooth transition
    );

  }, [overrideDate, location, camera, GCRS_TO_WORLD_FRAME_Q, controlsReady]); // Removed moonGCRSPosForCamera from dependencies

  return (
    <div ref={containerRef} className="fixed inset-0 size-full">
      {typeof window !== "undefined" && containerRef.current && (
        <Canvas
          eventSource={containerRef.current}
          camera={camera} // Use the main camera instance
        >
          <CameraControls 
            ref={(instance: CameraControls | null) => {
              controlsRef.current = instance;
              if (instance && !controlsReady) {
                setControlsReady(true);
              }
            }}
            makeDefault 
          /> 
          
          <SunRenderer overrideDate={overrideDate} />
          
          <AccurateEarth overrideDate={overrideDate} observerLocation={location}>
             {moonTexture && 
                <MoonRenderer 
                  moonTexture={moonTexture} 
                  overrideDate={overrideDate} 
                />}
             <pointLight position={[0, 0, 0]} intensity={0} /> 
             <ambientLight intensity={0.1} />
          </AccurateEarth>

          <NightSkyRenderer stars={allStars} />
          {constellationCultureData?.constellations && (
            <ConstellationLinesRenderer
              stars={allStars}
              constellationLinesData={constellationCultureData.constellations}
            />
          )}
          <PlanetsRenderer overrideDate={overrideDate} />
        </Canvas>
      )}
    </div>
  );
};