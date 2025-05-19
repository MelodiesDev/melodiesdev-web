"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3
} from "three";
import { CameraControls } from "@react-three/drei";
import brightStars from "../../data/bright_stars.json";

// Define star interface based on bright_stars.json structure
interface Star {
  id: string;
  mag: number; // Magnitude (visual brightness, lower is brighter)
  x: number; // Cartesian x (often for nearby stars or as fallback)
  y: number; // Cartesian y
  z: number; // Cartesian z
  color: string; // Intrinsic color
  atmospheric_color: string; // Color as seen through atmosphere
  temperature: number; // Kelvin
  spect: string; // Spectral type
  ci: string; // Color Index
  size?: number; // Physical size (solar radii or similar)
  dist?: number; // Distance (often in light-years or parsecs)
  ra?: number; // Right Ascension (hours, 0-24)
  dec?: number; // Declination (degrees, -90 to +90)
  lum?: number; // Luminosity (relative to Sol)
}

// Constants
const CELESTIAL_SPHERE_RADIUS = 50; // Radius for projecting stars
const MIN_VISUAL_MAGNITUDE = 6.5; // Faintest stars to render


// Helper to convert RA/Dec to Cartesian coordinates
const raDecToCartesian = (
  raHours: number,
  decDegrees: number,
  radius: number
): [number, number, number] => {
  const raRad = (raHours / 24) * 2 * Math.PI; // Convert RA from hours to radians
  const decRad = (decDegrees * Math.PI) / 180; // Convert Dec from degrees to radians

  // Standard spherical to Cartesian conversion
  // In Three.js, Y is typically up.
  // RA=0, Dec=0 points towards positive X if Y is up.
  // We might adjust this to align with common astronomical visualizations (e.g. Z towards North Celestial Pole)
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [-x, y, -z]; // Negate x and z for typical camera facing -Z
};


const tilt = 23.5; // Earths tilt
const radius = 6371;
const origin = new Vector3(0, 0, 0);

function latLonToPointOnSphere(
  latitude: number,
  longitude: number,
  tilt: number,
  radius: number,
  origin: { x: number, y: number, z: number }
): { x: number, y: number, z: number } {
  // Convert degrees to radians
  const latRad = (latitude + tilt) * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);

  // Calculate the Cartesian coordinates
  const x = origin.x + radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = origin.y + radius * Math.sin(latRad) * Math.sin(lonRad);
  const z = origin.z + radius * Math.cos(latRad);

  return { x, y, z };
}


// Main 3D component
export const THREEDComponents: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<GeolocationPosition | undefined>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLocation(position);
    });
  }, []);

  const camera = useMemo(() => {
    const cam = new ThreePerspectiveCamera(70, 1920 / 1080, 1, CELESTIAL_SPHERE_RADIUS * 2);
    cam.updateProjectionMatrix();
    return cam;
  }, []);

  useEffect(() => {
    // Get latitude and longitude
    const latitude = location?.coords.latitude;
    const longitude = location?.coords.longitude;
    if (!latitude || !longitude) return;

    // Calculate the point on the sphere
    const point = latLonToPointOnSphere(latitude, longitude, tilt, radius, origin);

    // Set the camera position to the point
    camera.lookAt(new Vector3(point.x, point.y, point.z));
    console.log("point", point, "location", location);
  }, [location, camera]);

  return (
    <div ref={containerRef} className="absolute m-0 p-0 h-full w-full">
      <Canvas
        eventSource={containerRef.current ?? undefined} // Ensure events are sourced from this div
        camera={camera}
      >
        {/* Earth sphere */}
        <mesh>
          <sphereGeometry args={[radius]} />
          <meshBasicMaterial color="blue" wireframe={true} />
        </mesh>

        <NightSkyRenderer stars={brightStars as Star[]} />
        <CameraControls camera={camera} makeDefault />
      </Canvas>
    </div>
  );
};

// Component to render the night sky
const NightSkyRenderer: FC<{ stars: Star[] }> = ({ stars }) => {
  const starFieldRef = useRef<Group>(null);

  // Filter out the Sun and stars too dim to see for a night sky view from Earth
  const visibleStars = useMemo(() => {
    return stars.filter(
      (star) => star.id !== `Sol` && star.mag < MIN_VISUAL_MAGNITUDE
    );
  }, [stars]);

  // Prepare geometry for all stars
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
        // Fallback: use x,y,z as directional vectors if RA/Dec are missing
        // This is less accurate for a celestial sphere but provides a fallback
        const dirLength = Math.sqrt(star.x ** 2 + star.y ** 2 + star.z ** 2) || 1;
        x = (star.x / dirLength) * CELESTIAL_SPHERE_RADIUS;
        y = (star.y / dirLength) * CELESTIAL_SPHERE_RADIUS;
        z = (star.z / dirLength) * CELESTIAL_SPHERE_RADIUS;
      }
      positions.push(x, y, z);

      // Color from atmospheric_color
      const starColor = new Color(star.atmospheric_color || "#FFFFFF");
      colors.push(starColor.r, starColor.g, starColor.b);

      // Size based on magnitude (lower mag = brighter = larger point)
      // This is a visual representation, not physical size
      // We want a logarithmic response, as magnitude is logarithmic
      // A magnitude difference of 5 is a factor of 100 in brightness
      // Max size for very bright stars (e.g., mag -1.5 like Sirius), min for dim ones
      const visualSize = Math.max(
        1, // Minimum visual size
        Math.pow(1.912, -star.mag)// Adjust divisor for overall scaling
      );
      pointSizes.push(visualSize);
    });

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
    geometry.setAttribute("pointSizeAttribute", new BufferAttribute(new Float32Array(pointSizes), 1)); // Custom attribute for shader

    return geometry;
  }, [visibleStars]);

  // Slow rotation for celestial sphere effect
  // useFrame(({ clock }) => {
  //   if (starFieldRef.current) {
  //     // Simulate Earth's rotation (very slow)
  //     // One full rotation (2*PI) per day (24 * 60 * 60 seconds)
  //     // This will be too slow to notice immediately, so we speed it up for demo
  //     const rotationSpeed = 0.025; // Radians per second (adjust for desired speed)
  //     starFieldRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
  //   }
  // });

  // Vertex Shader for star points
  const vertexShader = `
    attribute float pointSizeAttribute;
    varying vec3 vColor;
    uniform float uTime;

    // Pseudo-random function
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vColor = color; // Pass color to fragment shader
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      // Basic twinkling: slightly vary size over time based on star's position
      float twinkleFactor = 0.7 + 0.3 * rand(vec2(position.x + uTime * 0.1, position.y));
      
      gl_PointSize = pointSizeAttribute * twinkleFactor * (100.0 / -mvPosition.z); // Adjust size by distance and base size attribute
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment Shader for star points
  const fragmentShader = `
    varying vec3 vColor;
    uniform float uOpacity;

    void main() {
      // Create a soft circular point
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard; // Discard pixels outside the circle

      float strength = 1.0 - smoothstep(0.4, 0.5, dist); // Soft edge
      gl_FragColor = vec4(vColor, strength * uOpacity);
    }
  `;

  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0.0 },
    uOpacity: { value: 1 } // Overall opacity for stars
  }), []);

  useFrame(({ clock }) => {
    if (shaderUniforms) {
      shaderUniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <group ref={starFieldRef}>
      {/* Starry background using a simple sphere with texture would be better for many stars, but points are fine for fewer bright ones */}
      {/* Optional: A very distant sphere with a star texture for a dense background */}


      <points geometry={starGeometry}>
        <shaderMaterial
          uniforms={shaderUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          depthWrite={false} // Important for correct blending of transparent points
          transparent
          vertexColors // Use colors from geometry attribute
        />
      </points>
    </group>
  );
};