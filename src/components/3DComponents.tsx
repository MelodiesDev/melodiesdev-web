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
  Euler
} from "three";
import { CameraControls, Text, Billboard } from "@react-three/drei";
import brightStarsJson from "@/data/bright_stars.json";
import allConstellationsJson from "@/data/constellations.json";
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


// Constants
const CELESTIAL_SPHERE_RADIUS = 1500; // Increased radius for better constellation visibility (75 * 20)
const MIN_VISUAL_MAGNITUDE = 7; // Faintest stars to render for points

const tilt = 23.5; // Earths tilt
const earthRadius = 200; // Visual radius for Earth sphere, not actual (10 * 20)
const origin = new Vector3(0, 0, 0);

// Define Sun-related constants after earthRadius is defined
const SUN_SCENE_DISTANCE = CELESTIAL_SPHERE_RADIUS * 0.9; // Distance for the Sun in the scene
const SUN_VISUAL_RADIUS = earthRadius * 0.2; // Visual radius for the Sun in the scene


// Helper to convert RA/Dec to Cartesian coordinates
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
  onPositionUpdate?: (position: Vector3) => void; // Callback for Sun's GCRS position
}

const SunRenderer: FC<SunRendererProps> = ({ overrideDate, onPositionUpdate }) => {
  const sunRef = useRef<Group>(null!);
  // No local state for sunPosition here, it's determined by GCRS and passed out / used directly for group

  const sunGCRSVector = useMemo(() => {
    const now = overrideDate;
    const jd = (now.getTime() / 86400000) + 2440587.5; // Julian Date
    const t = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0

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


const AccurateEarth = (props: { overrideDate: Date; children?: React.ReactNode }) => {
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
    const Q_orientation_Z_up_Earth = new THREE.Quaternion().multiplyQuaternions(Q_PN, Q_spin); // This is GCRS_from_ECEF
    // Corrected multiplication order: WorldFrame_from_GCRS * GCRS_from_ECEF
    earthRef.current.quaternion.multiplyQuaternions(Y_UP_TO_Z_UP, Q_orientation_Z_up_Earth);
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[earthRadius, 64, 64]} />
      <meshStandardMaterial color="#2E61A8" wireframe={false} /> {/* Solid Earth */}
      {props.children}
    </mesh>
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
  const [currentSunGCRSPosition, setCurrentSunGCRSPosition] = useState<Vector3 | null>(null);

  const allStars = brightStarsJson as Star[];
  const constellationCultureData = allConstellationsJson as SkyCultureData;

  // Define the GCRS to World Frame transformation quaternion
  const GCRS_TO_WORLD_FRAME_Q = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLocation(position);
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

    // Calculate observer GCRS position using ECEF conversion
    const latRad = toRadians(effectiveLatitude);
    const lonRad = toRadians(effectiveLongitude);
    const x_fixed = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
    const y_fixed = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
    const z_fixed = earthRadius * Math.sin(latRad);
    const observerECEF = new THREE.Vector3(x_fixed, y_fixed, z_fixed);
    // observerGCRSPos is in GCRS
    const observerGCRSPos = observerECEF.clone().applyQuaternion(earthOrientationQ_GCRS);

    // observerUpVector_GCRS is in GCRS
    const observerUpVector_GCRS = observerGCRSPos.clone().normalize(); 
    const cameraElevation = earthRadius * 0.002; 
    // cameraPosition_GCRS is in GCRS
    const cameraPosition_GCRS = observerGCRSPos.clone().add(observerUpVector_GCRS.clone().multiplyScalar(cameraElevation));

    // --- Start: Convert GCRS vectors to World Frame for camera ---
    const sceneCameraPosition = cameraPosition_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    // Calculate localNorthDir_GCRS first, as it will be used for the camera's "up" vector
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
    // The camera's "up" should be local North when looking at Zenith
    const sceneCameraUp = localNorthDir_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    // --- End: Convert GCRS vectors to World Frame for camera ---

    controlsRef.current.camera.up.copy(sceneCameraUp); 

    // New logic for lookAtTargetGCRS: Fixed Azimuth/Elevation (currently set to Zenith)
    // These directional vectors (localEastDir_GCRS) are in GCRS
    // const localEastDir_GCRS = observerUpVector_GCRS.clone().cross(localNorthDir_GCRS).normalize(); // Not needed if looking at Zenith

    // const targetAzimuthDeg = 292.5; // WNW - Not used when looking at Zenith
    // const targetElevationDeg = 15;  // 15 degrees above horizon - Not used

    // const azimuthRad = toRadians(targetAzimuthDeg);
    // const elevationRad = toRadians(targetElevationDeg);

    const finalLookDir_GCRS = new THREE.Vector3();
    // finalLookDir_GCRS.addScaledVector(localEastDir_GCRS, Math.cos(elevationRad) * Math.sin(azimuthRad));
    // finalLookDir_GCRS.addScaledVector(localNorthDir_GCRS, Math.cos(elevationRad) * Math.cos(azimuthRad));
    // finalLookDir_GCRS.addScaledVector(observerUpVector_GCRS, Math.sin(elevationRad));
    // finalLookDir_GCRS.normalize(); 

    // --- Start: Modified to look at Zenith ---
    finalLookDir_GCRS.copy(observerUpVector_GCRS);
    // --- End: Modified to look at Zenith ---

    // lookAtTarget_GCRS is in GCRS
    const lookAtTarget_GCRS = cameraPosition_GCRS.clone().add(finalLookDir_GCRS.multiplyScalar(CELESTIAL_SPHERE_RADIUS));
    
    // --- Start: Convert GCRS target to World Frame for camera ---
    const sceneLookAtTarget = lookAtTarget_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    // --- End: Convert GCRS target to World Frame for camera ---


    controlsRef.current.setLookAt(
      sceneCameraPosition.x, sceneCameraPosition.y, sceneCameraPosition.z,
      sceneLookAtTarget.x, sceneLookAtTarget.y, sceneLookAtTarget.z,
      true // Enable smooth transition
    );

  }, [overrideDate, location, camera, GCRS_TO_WORLD_FRAME_Q, controlsReady]); // Added controlsReady to dependencies

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
          
          <SunRenderer overrideDate={overrideDate} onPositionUpdate={setCurrentSunGCRSPosition} />
          
          <AccurateEarth overrideDate={overrideDate}>
             {/* Camera is no longer a child here */}
             {/* Lights that should be part of Earth system can remain */}
             <pointLight position={[0, 0, 0]} intensity={0} /> {/* Placeholder inside Earth, effectively off */}
             <ambientLight intensity={0.1} />
          </AccurateEarth>

          <NightSkyRenderer stars={allStars} />
          {constellationCultureData?.constellations && (
            <ConstellationLinesRenderer
              stars={allStars}
              constellationLinesData={constellationCultureData.constellations}
            />
          )}
        </Canvas>
      )}
    </div>
  );
};