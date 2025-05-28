import React, { FC, useMemo } from 'react';
import * as THREE from 'three';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Vector3,
} from 'three';
import { Text, Billboard } from '@react-three/drei';
import { PlanetOrbitalElements, ReferenceEphemerisData, ReferenceEphemerisEntry, PlanetaryBodiesFileData } from './Types'; // Assuming Types.ts

// Helper functions (can be moved to a utils file if used by multiple components)
const toRadians = (degrees: number): number => degrees * Math.PI / 180;

const solveKepler = (meanAnomalyRad: number, eccentricity: number, iterations = 5): number => {
  let eccentricAnomalyRad = meanAnomalyRad;
  for (let i = 0; i < iterations; i++) {
    eccentricAnomalyRad = meanAnomalyRad + eccentricity * Math.sin(eccentricAnomalyRad);
  }
  return eccentricAnomalyRad;
};

const calculatePlanetHeliocentricEclipticPosition = (
  planet: PlanetOrbitalElements,
  jd: number, // Julian Day for the overrideDate
  J2000_JD: number // Pass J2000_JD
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

  const x_orb = distanceAU * Math.cos(trueAnomalyRad);
  const y_orb = distanceAU * Math.sin(trueAnomalyRad);

  const iRad = toRadians(planet.orbital_inclination_degrees);
  const omegaRad = toRadians(planet.longitude_of_ascending_node_deg); 
  const wRad = toRadians(planet.argument_of_perihelion_deg); 

  const cosOmega = Math.cos(omegaRad);
  const sinOmega = Math.sin(omegaRad);
  const cosW = Math.cos(wRad);
  const sinW = Math.sin(wRad);
  const cosI = Math.cos(iRad);
  const sinI = Math.sin(iRad);

  const Px = cosW * cosOmega - sinW * sinOmega * cosI;
  const Py = cosW * sinOmega + sinW * cosOmega * cosI;
  const Pz = sinW * sinI;

  const Qx = -sinW * cosOmega - cosW * sinOmega * cosI;
  const Qy = -sinW * sinOmega + cosW * cosOmega * cosI;
  const Qz = cosW * sinI;

  const x_ecl = Px * x_orb + Qx * y_orb;
  const y_ecl = Py * x_orb + Qy * y_orb;
  const z_ecl = Pz * x_orb + Qz * y_orb;
  
  return { x: x_ecl, y: y_ecl, z: z_ecl }; 
};

const heliocentricEclipticToApproxRaDec = (
  helioX: number, helioY: number, helioZ: number
): { raHours: number; decDegrees: number } => {
  let eclipticLongitudeRad = Math.atan2(helioY, helioX);
  if (eclipticLongitudeRad < 0) eclipticLongitudeRad += 2 * Math.PI;
  const raRad = eclipticLongitudeRad; 
  
  const dist = Math.sqrt(helioX*helioX + helioY*helioY + helioZ*helioZ);
  const eclipticLatitudeRad = Math.asin(helioZ / dist);
  
  const decRad = eclipticLatitudeRad;

  const raHours = (raRad * 12) / Math.PI;
  const decDegrees = toRadians(decRad) * 180 / Math.PI; // Corrected toDegrees usage
  
  return { raHours, decDegrees };
};

const raDecToCartesian = (
  raHours: number,
  decDegrees: number,
  radius: number
): [number, number, number] => {
  const raRad = (raHours / 24) * 2 * Math.PI; 
  const decRad = (decDegrees * Math.PI) / 180; 
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [x, y, -z]; 
};

interface PlanetPointData { // Renamed from PlanetRenderData to avoid conflict with prop name
    name: string;
    position: THREE.Vector3;
    color: THREE.Color;
    id: string;
    magnitude?: number | null;
    // celestialSphereRadius is now a direct prop to PlanetsRenderer
}

interface PlanetsRendererProps {
  overrideDate: Date;
  GCRS_TO_WORLD_FRAME_Q: THREE.Quaternion;
  planetaryBodiesData: PlanetaryBodiesFileData; // Use the more specific type
  referenceEphemerisJson: ReferenceEphemerisData;
  referenceDateEpoch: number;
  J2000_JD: number;
  CELESTIAL_SPHERE_RADIUS: number;
}

const getReferenceBodyData = (id: string, parsedEphemeris: ReferenceEphemerisData): ReferenceEphemerisEntry | undefined => {
    const row = parsedEphemeris.data.table.rows.find((r: { entry: { id: string } }) => r.entry.id.toLowerCase() === id.toLowerCase());
    return row?.cells[0];
};

const PlanetsRenderer: FC<PlanetsRendererProps> = ({
  overrideDate,
  GCRS_TO_WORLD_FRAME_Q,
  planetaryBodiesData,
  referenceEphemerisJson,
  referenceDateEpoch,
  J2000_JD,
  CELESTIAL_SPHERE_RADIUS
}) => {

  const planetsToDisplayData = useMemo(() => { // Renamed from planetsToRenderData to avoid conflict
    const calculatedPlanets: PlanetPointData[] = [];
    const currentEpoch = overrideDate.getTime();
    const overrideJD = (currentEpoch / 86400000) + 2440587.5;
    const isReferenceTime = Math.abs(currentEpoch - referenceDateEpoch) < 1000;

    const sourcePlanets = planetaryBodiesData.planets;

    sourcePlanets.forEach(p => {
      if (p.name.toLowerCase() === "earth" || p.name.toLowerCase() === "sun" || p.name.toLowerCase() === "moon") return;

      let raHours: number | undefined;
      let decDegrees: number | undefined;
      let name: string = p.name;
      let color = new Color(p.color || 0xffffff);
      const id = p.name.toLowerCase();
      let currentMagnitude: number | null | undefined = p.magnitude;

      if (isReferenceTime) {
        const refData = getReferenceBodyData(id, referenceEphemerisJson);
        if (refData) {
          raHours = parseFloat(refData.position.equatorial.rightAscension.hours);
          decDegrees = parseFloat(refData.position.equatorial.declination.degrees);
          name = refData.name;
          if (refData.extraInfo?.magnitude !== undefined) {
            currentMagnitude = refData.extraInfo.magnitude;
          }
        }
      } else {
        const helioEclPos = calculatePlanetHeliocentricEclipticPosition(p, overrideJD, J2000_JD);
        const approxRaDec = heliocentricEclipticToApproxRaDec(helioEclPos.x, helioEclPos.y, helioEclPos.z);
        raHours = approxRaDec.raHours;
        decDegrees = approxRaDec.decDegrees;
      }

      if (raHours !== undefined && decDegrees !== undefined) {
        const [x, y, z] = raDecToCartesian(raHours, decDegrees, CELESTIAL_SPHERE_RADIUS);
        const planetGCRSPosition = new Vector3(x, y, z);
        const planetWorldPosition = planetGCRSPosition.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
        calculatedPlanets.push({ name, position: planetWorldPosition, color, id, magnitude: currentMagnitude });
      }
    });
    return calculatedPlanets;
  }, [overrideDate, GCRS_TO_WORLD_FRAME_Q, planetaryBodiesData, referenceEphemerisJson, referenceDateEpoch, J2000_JD, CELESTIAL_SPHERE_RADIUS]);


  const planetPointsGeometry = useMemo(() => { // Renamed from planetPoints to avoid conflict with variable name below
    if (planetsToDisplayData.length === 0) return null;
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const pointSizes: number[] = [];
    const MIN_PLANET_POINT_SIZE = 0.3;
    const MAG_BASE = 2.0;
    const MAG_SCALAR = 2.5;

    planetsToDisplayData.forEach(planet => {
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
  }, [planetsToDisplayData]);

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

  if (!planetPointsGeometry) return null;

  return (
    <group>
      <points geometry={planetPointsGeometry}>
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
      {planetsToDisplayData.map((planet) => (
        <Billboard key={planet.id} position={planet.position.clone().multiplyScalar(1.02)} follow={true}>
          <Text
            fontSize={CELESTIAL_SPHERE_RADIUS / 70} // Use prop directly
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

export default PlanetsRenderer; 