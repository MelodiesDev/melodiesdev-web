"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
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
import * as THREE from 'three';
import SunRenderer from './SunRenderer'; 
import MoonRenderer from './MoonRenderer'; 
import PlanetsRenderer from './PlanetsRenderer'; 
// import SkyDome from './SkyDome'; 
import { Star, SkyCultureData, ConstellationData, AsterismData, ReferenceEphemerisEntry } from './Types';

const CELESTIAL_SPHERE_RADIUS = 1500; 
const MIN_VISUAL_MAGNITUDE = 7; 
const tilt = 23.5; 
const earthRadius = 200; 
const origin = new Vector3(0, 0, 0);

const toRadians = (degrees: number): number => degrees * Math.PI / 180; 
const arcsecToRadians = (arcsec: number): number => toRadians(arcsec / 3600);
const toDegrees = (radians: number): number => radians * 180 / Math.PI;

const latLonToLocalPointOnSphere = (
  latitude: number,
  longitude: number,
  radius: number
): [number, number, number] => {
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);
  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lonRad);
  return [x, y, z];
};

const localRaDecToCartesian = (
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

const ConstellationLinesRenderer: FC<{ stars: Star[]; constellationLinesData: ConstellationData[] }> = ({ stars, constellationLinesData }) => {
  const starHipMap = useMemo(() => {
    const map = new Map<number, Vector3>();
    stars.forEach(star => {
      if (star.hip && star.ra !== undefined && star.dec !== undefined) {
        const [x, y, z] = localRaDecToCartesian(star.ra, star.dec, CELESTIAL_SPHERE_RADIUS);
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
        for (let i = 0; i < lineSegment.length - 1; i++) {
          const star1Hip = lineSegment[i];
          const star2Hip = lineSegment[i+1];
          const star1Pos = starHipMap.get(star1Hip);
          const star2Pos = starHipMap.get(star2Hip);
          if (star1Pos && star2Pos) {
            individualConstellationLinePoints.push(star1Pos.clone(), star2Pos.clone());
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

const NightSkyRenderer: FC<{ stars: Star[] }> = ({ stars }) => {
  const starFieldRef = useRef<Group>(null!);
  const BRIGHT_STAR_LABEL_MAGNITUDE_THRESHOLD = 2.3;
  const { clock } = useThree();

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
        [x, y, z] = localRaDecToCartesian(star.ra, star.dec, CELESTIAL_SPHERE_RADIUS);
      } else {
        const dirLength = Math.sqrt(star.x ** 2 + star.y ** 2 + star.z ** 2) || 1;
        x = (star.x / dirLength) * CELESTIAL_SPHERE_RADIUS;
        y = (star.y / dirLength) * CELESTIAL_SPHERE_RADIUS;
        z = (star.z / dirLength) * CELESTIAL_SPHERE_RADIUS;
      }
      positions.push(x, y, z);
      const starColor = new Color(star.atmospheric_color || "#FFFFFF");
      colors.push(starColor.r, starColor.g, starColor.b);
      const MAX_STAR_SIZE = 30.0;
      const visualSize = star.mag < 2.0 
        ? Math.min(MAX_STAR_SIZE, Math.max(20.0, 60.0 - (star.mag * 30))) 
        : Math.min(MAX_STAR_SIZE, Math.max(2.0, Math.pow(2.0, -star.mag) * 4.0));
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
        [x, y, z] = localRaDecToCartesian(star.ra, star.dec, CELESTIAL_SPHERE_RADIUS);
      } else {
        const dirLength = Math.sqrt(star.x ** 2 + star.y ** 2 + star.z ** 2) || 1;
        x = (star.x / dirLength) * CELESTIAL_SPHERE_RADIUS;
        y = (star.y / dirLength) * CELESTIAL_SPHERE_RADIUS;
        z = (star.z / dirLength) * CELESTIAL_SPHERE_RADIUS;
      }
      labels.push({ id: star.id, position: new Vector3(x, y, z).multiplyScalar(1.01) });
      labeledIds.add(star.id);
    });
    return labels;
  }, [visibleStars]);

  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0.0 }
  }), []);

  useEffect(() => {
    const id = setInterval(() => {
      shaderUniforms.uTime.value = clock.getElapsedTime();
    }, 50); 
    return () => clearInterval(id);
  }, [clock, shaderUniforms.uTime]);

  const vertexShader = `
    uniform float uTime;
    attribute float pointSizeAttribute;
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      vColor = color * 2.0;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float time = uTime * 0.1;
      float randomVal = fract(sin(dot(position.xy + time, vec2(12.9898, 78.233))) * 43758.5453);
      vOpacity = randomVal > 0.8 ? 0.8 : 1.0;
      gl_PointSize = pointSizeAttribute * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      float glow = 1.0 - (dist * 1.5);
      vec3 brightColor = vColor + (vec3(1.0) * glow * 0.5);
      
      gl_FragColor = vec4(brightColor, vOpacity);
    }
  `;

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
            fontSize={CELESTIAL_SPHERE_RADIUS / 80}
            color="#FFFFCC"
            anchorX="left"
            anchorY="middle"
            material-depthWrite={false}
          >
            {label.id}
          </Text>
        </Billboard>
      ))}
    </group>
  );
};

const AccurateEarth = (props: { overrideDate: Date; children?: React.ReactNode; observerLocation?: GeolocationPosition }) => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const Y_UP_TO_Z_UP = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), []);

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
    earthRef.current.quaternion.multiplyQuaternions(Y_UP_TO_Z_UP, earthOrientationQ_GCRS); 
  });

  return (
    <mesh ref={earthRef}>
      {props.children}
    </mesh>
  );
};

interface THREEDComponentsProps {
  overrideDate: Date;
  observerLocation?: GeolocationPosition;
}

export const THREEDComponents: FC<THREEDComponentsProps> = ({ overrideDate, observerLocation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<CameraControls | null>(null);
  const [controlsReady, setControlsReady] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | undefined>(observerLocation);
  const [moonTexture, setMoonTexture] = useState<THREE.Texture | null>(null);

  const allStars = brightStarsJson as Star[];
  const constellationCultureData = allConstellationsJson as SkyCultureData;
  const GCRS_TO_WORLD_FRAME_Q = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), []);

  useEffect(() => {
    if (observerLocation) {
      setLocation(observerLocation);
    } else {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setLocation(position);
        },
        () => {
          // Silently default to 0,0 if geolocation fails
          const defaultPosition = {
            coords: {
              latitude: 0,
              longitude: 0,
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON() {
                return {
                  latitude: this.latitude,
                  longitude: this.longitude,
                  accuracy: this.accuracy,
                  altitude: this.altitude,
                  altitudeAccuracy: this.altitudeAccuracy,
                  heading: this.heading,
                  speed: this.speed
                };
              }
            },
            timestamp: Date.now(),
            toJSON() {
              return {
                coords: this.coords,
                timestamp: this.timestamp
              };
            }
          };
          setLocation(defaultPosition as GeolocationPosition);
        }
      );
    }
    const loader = new TextureLoader();
    loader.load('/moon.jpg', (texture: THREE.Texture) => {
      setMoonTexture(texture);
    });
  }, []);

  const camera = useMemo(() => {
    const camInstance = new ThreePerspectiveCamera(60, typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1, 0.1, CELESTIAL_SPHERE_RADIUS * 5 );
    camInstance.position.set(...origin.toArray());
    camInstance.position.y = earthRadius * 1.5; 
    camInstance.position.z = earthRadius * 1.5;
    return camInstance;
  }, []);

  useEffect(() => {
    const effectiveDate = overrideDate;
    const currentObserverLocation = observerLocation || location;
    const effectiveLatitude = currentObserverLocation?.coords?.latitude ?? 0;
    const effectiveLongitude = currentObserverLocation?.coords?.longitude ?? 0;

    if (!controlsReady || !controlsRef.current || !camera) { 
      return;
    }
    
    const now = effectiveDate; 
    const jd = (now.getTime() / 86400000) + 2440587.5;
    const t = (jd - 2451545.0) / 36525;

    const epsilon0_arcsec = 84381.406 - 46.836769 * t - 0.0001831 * t*t + 0.00200340 * t*t*t - 0.000000576 * t*t*t*t - 0.0000000434 * t*t*t*t*t;
    const meanObliquity_rad = arcsecToRadians(epsilon0_arcsec);
    const nutationInLongitude_rad = arcsecToRadians(0); 
    const nutationInObliquity_rad = arcsecToRadians(0); 
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
    const sceneCameraTrueUp_world = observerUpVector_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    controlsRef.current.camera.up.copy(sceneCameraTrueUp_world); 

    // Simplified look-at: always Zenith
    const finalLookDir_GCRS = observerUpVector_GCRS.clone();
    console.log(`[THREEDComponents] Camera target: Zenith (Local Hour: ${effectiveDate.getHours()}, UTC Hour: ${effectiveDate.getUTCHours()})`);
    
    const lookAtTarget_GCRS = cameraPosition_GCRS.clone().add(finalLookDir_GCRS.multiplyScalar(CELESTIAL_SPHERE_RADIUS));
    const sceneLookAtTarget = lookAtTarget_GCRS.clone().applyQuaternion(GCRS_TO_WORLD_FRAME_Q);
    const lineOfSightWorld = sceneLookAtTarget.clone().sub(sceneCameraPosition).normalize();
    let cameraUpForSetLookAt = sceneCameraTrueUp_world.clone(); 
    if (Math.abs(lineOfSightWorld.dot(cameraUpForSetLookAt)) > 0.999) { 
        if (Math.abs(lineOfSightWorld.y) > 0.9) { cameraUpForSetLookAt.set(1, 0, 0); } 
        else { cameraUpForSetLookAt.set(0, 1, 0); }
        if (Math.abs(lineOfSightWorld.dot(cameraUpForSetLookAt)) > 0.999) { cameraUpForSetLookAt.set(0, 0, 1); }
    }
    controlsRef.current.camera.up.copy(cameraUpForSetLookAt); 
    controlsRef.current.setLookAt( sceneCameraPosition.x, sceneCameraPosition.y, sceneCameraPosition.z, sceneLookAtTarget.x, sceneLookAtTarget.y, sceneLookAtTarget.z, true );
  }, [overrideDate, location, camera, GCRS_TO_WORLD_FRAME_Q, controlsReady, observerLocation]); 

  return (
    <div ref={containerRef} className="fixed inset-0 size-full">
      {typeof window !== "undefined" && containerRef.current && (
        <Canvas
          eventSource={containerRef.current}
          camera={camera}
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

          <AccurateEarth overrideDate={overrideDate} observerLocation={observerLocation || location}>
          </AccurateEarth>

          <NightSkyRenderer  stars={allStars} />
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