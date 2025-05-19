"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3
} from "three";
import { CameraControls, Text, Billboard } from "@react-three/drei";

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
const CELESTIAL_SPHERE_RADIUS = 100; // Increased radius for better constellation visibility
const MIN_VISUAL_MAGNITUDE = 6.5; // Faintest stars to render for points


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


const tilt = 23.5; // Earths tilt
const earthRadius = 10; // Visual radius for Earth sphere, not actual
const origin = new Vector3(0, 0, 0);

function latLonToPointOnSphere(
  latitude: number,
  longitude: number,
  _tilt: number, // tilt is not directly used here for camera lookAt, but good to have for other calcs
  _radius: number, // sphere radius not used for direction
  _origin: Vector3
): Vector3 {
  // Convert degrees to radians
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);

  // Calculate direction vector from Earth's center to the location on surface
  // This determines the "up" direction for the observer
  const x = Math.cos(latRad) * Math.cos(lonRad);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.sin(lonRad);

  // The point to look at is in the direction of the zenith for the observer.
  // We want to point the camera from origin towards this zenith point on the celestial sphere.
  return new Vector3(x, y, z).multiplyScalar(CELESTIAL_SPHERE_RADIUS);
}

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

  const constellationLineSegments = useMemo(() => {
    const lines: Vector3[] = [];
    const constellationNames: { name: string, position: Vector3 }[] = [];

    // Filter constellations that have an associated image file.
    const processedConstellations = constellationLinesData.filter(
      (con) => !!con.image?.file // Removed : any, type is now inferred correctly
    );

    processedConstellations.forEach((constellation) => { // Removed : any, type is now inferred correctly
      const linePointsForThisConstellation: Vector3[] = [];
      constellation.lines.forEach((lineSegment: number[]) => { // Type for lineSegment remains
        for (let i = 0; i < lineSegment.length - 1; i++) {
          const star1Pos = starHipMap.get(lineSegment[i]);
          const star2Pos = starHipMap.get(lineSegment[i + 1]);

          if (star1Pos && star2Pos) {
            lines.push(star1Pos.clone(), star2Pos.clone());
            linePointsForThisConstellation.push(star1Pos.clone());
            if (i === lineSegment.length -2) {
                linePointsForThisConstellation.push(star2Pos.clone());
            }
          }
        }
      });

      if (linePointsForThisConstellation.length > 0) {
        const centroid = new Vector3();
        linePointsForThisConstellation.forEach(p => centroid.add(p));
        centroid.divideScalar(linePointsForThisConstellation.length);
        constellationNames.push({
            name: constellation.common_name?.native || constellation.common_name?.english || constellation.id, // Prioritize native name
            position: centroid.multiplyScalar(1.05)
        });
      }
    });

    if (lines.length === 0) return null;

    const geometry = new BufferGeometry().setFromPoints(lines);
    const material = new LineBasicMaterial({ color: 0x446688, linewidth: 0.5, transparent: true, opacity: 0.5 });

    return { geometry, material, names: constellationNames };
  }, [starHipMap, constellationLinesData]);

  if (!constellationLineSegments) return null;

  return (
    <group>
      <lineSegments geometry={constellationLineSegments.geometry} material={constellationLineSegments.material} />
      {constellationLineSegments.names.map((item, index) => (
        <Billboard key={index} position={item.position} follow={true}>
          <Text
            fontSize={CELESTIAL_SPHERE_RADIUS / 100}
            color="lightblue"
            anchorX="center"
            anchorY="middle"
            maxWidth={200}
            >
            {item.name}
          </Text>
        </Billboard>
      ))}
    </group>
  );
};

// Component to render the star points
const NightSkyRenderer: FC<{ stars: Star[] }> = ({ stars }) => {
  const starFieldRef = useRef<Group>(null);
  const BRIGHT_STAR_LABEL_MAGNITUDE_THRESHOLD = 2.0; // Stars brighter than this will be labeled

  const visibleStars = useMemo(() => {
    return stars.filter(
      (star) => star.id !== 'Sol' && star.mag < MIN_VISUAL_MAGNITUDE
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
        0.5, // Minimum visual size
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
      labels.push({ id: star.id, position: new Vector3(x, y, z).multiplyScalar(1.02) });
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
      float twinkleFactor = 0.6 + 0.4 * rand(vec2(position.x + uTime * 0.05, position.y));
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
            fontSize={CELESTIAL_SPHERE_RADIUS / 150} // Adjust size as needed
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

// Main 3D component
export const THREEDComponents: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<GeolocationPosition | undefined>();
  const [constellationCultureData, setConstellationCultureData] = useState<SkyCultureData | null>(null);
  const [allStarsData, setAllStarsData] = useState<Star[] | null>(null); // Added state for allStarsData

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLocation(position);
    });

    fetch('/data/constellations.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.constellations) {
          setConstellationCultureData(data as SkyCultureData);
        } else {
          setConstellationCultureData({ id: data.id, constellations: data.constellations } as SkyCultureData);
        }
      })
      .catch(err => console.error("Failed to load constellation data from /data/constellations.json:", err));

    fetch('/data/bright_stars.json') // Fetch bright_stars.json
      .then(res => res.json())
      .then(data => {
        setAllStarsData(data as Star[]);
      })
      .catch(err => console.error("Failed to load star data from /data/bright_stars.json:", err));
  }, []);

  const camera = useMemo(() => {
    const camInstance = new ThreePerspectiveCamera(60, typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1, 0.1, CELESTIAL_SPHERE_RADIUS * 2.5);
    camInstance.position.set(0, 0, 0);
    return camInstance;
  }, []);

  useEffect(() => {
    if (!location?.coords || !camera) return;

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const lookAtPoint = latLonToPointOnSphere(latitude, longitude, tilt, earthRadius, origin);

    // Determine camera up vector based on hemisphere
    const cameraUp = new Vector3(0, 1, 0); // Default for Northern Hemisphere
    if (latitude < 0) { // Southern Hemisphere
      cameraUp.set(0, -1, 0);
    }
    camera.up.copy(cameraUp);

    camera.lookAt(lookAtPoint);
    camera.updateProjectionMatrix(); // Important after changing lookAt

  }, [location, camera]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (camera && typeof window !== "undefined") {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [camera]);

  // Now derive allStars from allStarsData state
  const allStars = useMemo(() => allStarsData || [], [allStarsData]);

  return (
    <div ref={containerRef} className="absolute m-0 p-0 h-full w-full">
      {typeof window !== "undefined" && containerRef.current && allStarsData && constellationCultureData && ( // Render only when data is loaded
        <Canvas
          eventSource={containerRef.current}
          camera={camera}
        >
          {/* Earth sphere (optional, can be very small or just a visual cue) */}
          <mesh scale={[earthRadius, earthRadius, earthRadius]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#000044" wireframe={false} opacity={0.7} transparent />
          </mesh>

          <group> {/* Group for all sky elements, no longer rotating here */}
            <NightSkyRenderer stars={allStars} />
            {constellationCultureData?.constellations && (
              <ConstellationLinesRenderer
                stars={allStars}
                constellationLinesData={constellationCultureData.constellations}
              />
            )}
          </group>
          <CameraControls makeDefault minDistance={earthRadius * 1.1} maxDistance={CELESTIAL_SPHERE_RADIUS * 1.5} dollySpeed={0.5} />
        </Canvas>
      )}
    </div>
  );
};