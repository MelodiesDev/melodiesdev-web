import React, { FC, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Group, Vector3 } from 'three';
import { ReferenceEphemerisData, ReferenceEphemerisEntry } from '@/components/Types';

// Helper functions (can be moved to a utils file if used by multiple components)
const toRadians = (degrees: number): number => degrees * Math.PI / 180;
const arcsecToRadians = (arcsec: number): number => toRadians(arcsec / 3600);

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
  return [x, y, -z]; // Consistent with 3DComponents
};

interface SunRendererProps {
  overrideDate: Date;
  GCRS_TO_WORLD_FRAME_Q: THREE.Quaternion;
  referenceEphemerisJson: ReferenceEphemerisData;
  referenceDateEpoch: number;
  SUN_SCENE_DISTANCE: number;
  SUN_VISUAL_RADIUS: number;
}

// getReferenceBodyData needs to be available here
const getReferenceBodyData = (id: string, parsedEphemeris: ReferenceEphemerisData): ReferenceEphemerisEntry | undefined => {
  const row = parsedEphemeris.data.table.rows.find((r: { entry: { id: string } }) => r.entry.id.toLowerCase() === id.toLowerCase());
  return row?.cells[0];
};

const SunRenderer: FC<SunRendererProps> = ({
  overrideDate,
  GCRS_TO_WORLD_FRAME_Q,
  referenceEphemerisJson,
  referenceDateEpoch,
  SUN_SCENE_DISTANCE,
  SUN_VISUAL_RADIUS,
}) => {
  const sunRef = useRef<Group>(null!);
  const J2000_JD_internal = 2451545.0; // Defined internally if not passed

  const sunWorldPosition = useMemo(() => {
    const currentEpoch = overrideDate.getTime();
    const jd_sun = (overrideDate.getTime() / 86400000) + 2440587.5;
    const t_sun = (jd_sun - J2000_JD_internal) / 36525;

    let raHours: number | undefined;
    let decDegrees: number | undefined;

    if (Math.abs(currentEpoch - referenceDateEpoch) < 1000) {
      const sunRefData = getReferenceBodyData("sun", referenceEphemerisJson);
      if (sunRefData?.position?.equatorial) {
        raHours = parseFloat(sunRefData.position.equatorial.rightAscension.hours);
        decDegrees = parseFloat(sunRefData.position.equatorial.declination.degrees);
      }
    }

    if (raHours !== undefined && decDegrees !== undefined) {
      const [x, y, z] = raDecToCartesian(raHours, decDegrees, SUN_SCENE_DISTANCE);
      return new Vector3(x, y, z).applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    } else {
      const L0_sun = 280.46646; const L1_sun = 36000.76983; const L2_sun = 0.0003032;
      const M0_sun = 357.52911; const M1_sun = 35999.05029; const M2_sun = -0.0001537;
      const C1_sun = 1.914602; const C1t_sun = -0.004817; const C1t2_sun = -0.000014;
      const C2_sun = 0.019993; const C2t_sun = -0.000101;
      const C3_sun = 0.000289;

      let L_sun_deg = (L0_sun + L1_sun * t_sun + L2_sun * t_sun * t_sun) % 360;
      if (L_sun_deg < 0) L_sun_deg += 360;
      let M_sun_deg = (M0_sun + M1_sun * t_sun + M2_sun * t_sun * t_sun) % 360;
      if (M_sun_deg < 0) M_sun_deg += 360;
      const M_sun_rad = toRadians(M_sun_deg);
      
      const C_sun_deg = (C1_sun + C1t_sun * t_sun + C1t2_sun * t_sun * t_sun) * Math.sin(M_sun_rad) +
                        (C2_sun + C2t_sun * t_sun) * Math.sin(2 * M_sun_rad) +
                        C3_sun * Math.sin(3 * M_sun_rad);
      const lambda_sun_ecl_deg = L_sun_deg + C_sun_deg;
      const lambda_sun_ecl_rad = toRadians(lambda_sun_ecl_deg);
      
      const epsilon0_arcsec_sun = 84381.406 - 46.836769 * t_sun - 0.0001831 * t_sun*t_sun + 0.00200340 * t_sun*t_sun*t_sun - 0.000000576 * t_sun*t_sun*t_sun*t_sun - 0.0000000434 * t_sun*t_sun*t_sun*t_sun*t_sun;
      const meanObliquity_rad_sun = arcsecToRadians(epsilon0_arcsec_sun);
      const cos_eps_sun = Math.cos(meanObliquity_rad_sun);
      const sin_eps_sun = Math.sin(meanObliquity_rad_sun);

      const x_ecl_sun = SUN_SCENE_DISTANCE * Math.cos(lambda_sun_ecl_rad);
      const y_ecl_sun = SUN_SCENE_DISTANCE * Math.sin(lambda_sun_ecl_rad);

      const sunGCRS = new THREE.Vector3(
          x_ecl_sun,
          y_ecl_sun * cos_eps_sun, 
          y_ecl_sun * sin_eps_sun  
      );
      return sunGCRS.applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    }
  }, [overrideDate, GCRS_TO_WORLD_FRAME_Q, referenceEphemerisJson, referenceDateEpoch, SUN_SCENE_DISTANCE, J2000_JD_internal]);

  useEffect(() => {
    if (sunRef.current) {
      sunRef.current.position.copy(sunWorldPosition);
    }
  }, [sunWorldPosition]);

  return (
    <group ref={sunRef}>
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

export default SunRenderer; 