import React, { FC, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Group, Vector3, Texture } from 'three';
import { PlanetOrbitalElements, ReferenceEphemerisData, ReferenceEphemerisEntry } from './Types';

// Helper functions (can be moved to a utils file if used by multiple components)
const toRadians = (degrees: number): number => degrees * Math.PI / 180;
const arcsecToRadians = (arcsec: number): number => toRadians(arcsec / 3600);

const raDecToCartesian = (
  raHours: number,
  decDegrees: number,
  radius: number
): [number, number, number] => {
  const raRad = (raHours / 24) * 2 * Math.PI;
  const decRad = (decDegrees * Math.PI / 180);
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [x, y, -z];
};

const solveKepler = (meanAnomalyRad: number, eccentricity: number, iterations = 5): number => {
  let eccentricAnomalyRad = meanAnomalyRad;
  for (let i = 0; i < iterations; i++) {
    eccentricAnomalyRad = meanAnomalyRad + eccentricity * Math.sin(eccentricAnomalyRad);
  }
  return eccentricAnomalyRad;
};

interface MoonRendererProps {
  overrideDate: Date;
  GCRS_TO_WORLD_FRAME_Q: THREE.Quaternion;
  moonTexture: THREE.Texture | null;
  planetaryBodiesData: { planets: PlanetOrbitalElements[] };
  referenceEphemerisJson: ReferenceEphemerisData;
  referenceDateEpoch: number;
  J2000_JD: number;
  MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS: number;
  MOON_VISUAL_RADIUS: number;
}

const getReferenceBodyData = (id: string, parsedEphemeris: ReferenceEphemerisData): ReferenceEphemerisEntry | undefined => {
    const row = parsedEphemeris.data.table.rows.find((r: { entry: { id: string } }) => r.entry.id.toLowerCase() === id.toLowerCase());
    return row?.cells[0];
};

const MoonRenderer: FC<MoonRendererProps> = ({
  overrideDate,
  GCRS_TO_WORLD_FRAME_Q,
  moonTexture,
  planetaryBodiesData,
  referenceEphemerisJson,
  referenceDateEpoch,
  J2000_JD,
  MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS,
  MOON_VISUAL_RADIUS,
}) => {
  const moonRef = useRef<Group>(null!);

  const moonWorldPosition = useMemo(() => {
    const moonData = planetaryBodiesData.planets.find(p => p.name.toLowerCase() === 'moon');
    if (!moonData) return new Vector3();

    const jd_moon = (overrideDate.getTime() / 86400000) + 2440587.5;
    const t_moon = (jd_moon - J2000_JD) / 36525;

    let raHours: number | undefined;
    let decDegrees: number | undefined;

    const daysSinceEpochMoon = jd_moon - J2000_JD;
    const meanMotionRadPerDayMoon = (2 * Math.PI) / moonData.orbital_period_days;
    let meanAnomalyRadMoon = toRadians(moonData.mean_anomaly_at_epoch_deg) + meanMotionRadPerDayMoon * daysSinceEpochMoon;
    meanAnomalyRadMoon = meanAnomalyRadMoon % (2 * Math.PI);
    if (meanAnomalyRadMoon < 0) meanAnomalyRadMoon += (2 * Math.PI);
    const eccentricityMoon = moonData.orbital_eccentricity;
    const eccentricAnomalyRadMoon = solveKepler(meanAnomalyRadMoon, eccentricityMoon);
    const rMoonSceneUnits = MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS * (1 - eccentricityMoon * Math.cos(eccentricAnomalyRadMoon));

    if (Math.abs(overrideDate.getTime() - referenceDateEpoch) < 1000) {
      const refMoonData = getReferenceBodyData("moon", referenceEphemerisJson);
      if (refMoonData?.position?.equatorial) {
        raHours = parseFloat(refMoonData.position.equatorial.rightAscension.hours);
        decDegrees = parseFloat(refMoonData.position.equatorial.declination.degrees);
      }
    }

    if (raHours !== undefined && decDegrees !== undefined) {
      const [x, y, z] = raDecToCartesian(raHours, decDegrees, rMoonSceneUnits);
      return new Vector3(x, y, z).applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    } else {
      const trueAnomalyRadMoon = 2 * Math.atan2(
        Math.sqrt(1 + eccentricityMoon) * Math.sin(eccentricAnomalyRadMoon / 2),
        Math.sqrt(1 - eccentricityMoon) * Math.cos(eccentricAnomalyRadMoon / 2)
      );
      const x_op_moon = rMoonSceneUnits * Math.cos(trueAnomalyRadMoon);
      const y_op_moon = rMoonSceneUnits * Math.sin(trueAnomalyRadMoon);

      const iRad_moon_ecl = toRadians(moonData.orbital_inclination_degrees);
      const omegaRad_moon_ecl = toRadians(moonData.longitude_of_ascending_node_deg);
      const wRad_moon_ecl = toRadians(moonData.argument_of_perihelion_deg);
      
      const cosOmega_ecl = Math.cos(omegaRad_moon_ecl); const sinOmega_ecl = Math.sin(omegaRad_moon_ecl);
      const cosW_ecl = Math.cos(wRad_moon_ecl); const sinW_ecl = Math.sin(wRad_moon_ecl);
      const cosI_ecl = Math.cos(iRad_moon_ecl); const sinI_ecl = Math.sin(iRad_moon_ecl);

      const Px_ecl = cosW_ecl * cosOmega_ecl - sinW_ecl * sinOmega_ecl * cosI_ecl;
      const Py_ecl = cosW_ecl * sinOmega_ecl + sinW_ecl * cosOmega_ecl * cosI_ecl;
      const Pz_ecl = sinW_ecl * sinI_ecl;
      const Qx_ecl = -sinW_ecl * cosOmega_ecl - cosW_ecl * sinOmega_ecl * cosI_ecl;
      const Qy_ecl = -sinW_ecl * sinOmega_ecl + cosW_ecl * cosOmega_ecl * cosI_ecl;
      const Qz_ecl = cosW_ecl * sinI_ecl;

      const moonEclipticPos = new THREE.Vector3(
        Px_ecl * x_op_moon + Qx_ecl * y_op_moon,
        Py_ecl * x_op_moon + Qy_ecl * y_op_moon,
        Pz_ecl * x_op_moon + Qz_ecl * y_op_moon
      );
      
      const epsilon0_arcsec_moon = 84381.406 - 46.836769 * t_moon - 0.0001831 * t_moon*t_moon + 0.00200340 * t_moon*t_moon*t_moon - 0.000000576 * t_moon*t_moon*t_moon*t_moon - 0.0000000434 * t_moon*t_moon*t_moon*t_moon*t_moon;
      const meanObliquity_rad_moon = arcsecToRadians(epsilon0_arcsec_moon);
      const cosEpsMoon = Math.cos(meanObliquity_rad_moon);
      const sinEpsMoon = Math.sin(meanObliquity_rad_moon);

      const moonGCRS = new THREE.Vector3(
        moonEclipticPos.x,
        moonEclipticPos.y * cosEpsMoon - moonEclipticPos.z * sinEpsMoon,
        moonEclipticPos.y * sinEpsMoon + moonEclipticPos.z * cosEpsMoon
      );
      return moonGCRS.applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    }
  }, [overrideDate, GCRS_TO_WORLD_FRAME_Q, planetaryBodiesData, referenceEphemerisJson, referenceDateEpoch, J2000_JD, MOON_ORBIT_SCENE_SEMI_MAJOR_AXIS]);

  useEffect(() => {
    if (moonRef.current) {
      moonRef.current.position.copy(moonWorldPosition);
    }
  }, [moonWorldPosition]);

  if (!moonTexture) return null;

  return (
    <group ref={moonRef}>
      <mesh>
        <sphereGeometry args={[MOON_VISUAL_RADIUS, 32, 32]} />
        <meshStandardMaterial map={moonTexture} roughness={0.9} />
      </mesh>
    </group>
  );
};

export default MoonRenderer; 