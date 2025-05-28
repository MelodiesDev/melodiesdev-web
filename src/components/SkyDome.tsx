import React, { FC, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// SkyDome Component based on three.js Sky example
interface SkyDomeProps {
  sunPosition: THREE.Vector3;
  skyRadius: number; // New prop for dynamic radius
  baseOpacity: number; // New prop for base daytime opacity
  observerSunElevationFactor: number; // New prop for observer's sun elevation factor
}

const SkyDome: FC<SkyDomeProps> = ({ sunPosition, skyRadius, baseOpacity, observerSunElevationFactor }) => {
  const skyRef = useRef<THREE.Mesh>(null!);

  const skyMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        sunPosition: { value: new THREE.Vector3() }, // Will be updated with normalized direction
        up: { value: new THREE.Vector3(0, 1, 0) }, // Assuming Y is up in world space for skybox
        uBaseOpacity: { value: baseOpacity }, // Use prop for base opacity
        uObserverSunElevationFactor: { value: observerSunElevationFactor }, // New prop for observer's sun elevation factor
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform vec3 sunPosition; // Normalized direction to the sun in world space
        uniform vec3 up; // World up vector (0,1,0)
        uniform float uBaseOpacity;
        uniform float uObserverSunElevationFactor;

        const float pi = 3.141592653589793238462643383279502884197169;

        void main() {
          vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
          vec3 sunDirection = normalize(sunPosition);

          // Simplified sky color based on sun elevation
          vec3 daySkyColor = vec3(0.5, 0.7, 0.9); // Light blue for day
          vec3 nightSkyColor = vec3(0.01, 0.02, 0.05); // Dark blue for night
          vec3 horizonColor = vec3(0.8, 0.6, 0.4); // Orangey near horizon at sunset/sunrise

          // Blend between day and night based on OBSERVER'S sun elevation factor
          float dayFactor = smoothstep(0.0, 0.15, uObserverSunElevationFactor); // Use observer factor, maybe a tighter transition (0.0 to 0.15)

          vec3 skyColor = mix(nightSkyColor, daySkyColor, dayFactor);

          // Add a horizon glow effect when sun is near horizon (using observer factor)
          float horizonSmoothFactor = smoothstep(0.0, 0.1, uObserverSunElevationFactor) * (1.0 - smoothstep(0.1, 0.20, uObserverSunElevationFactor));
          // Make horizon glow stronger towards the horizon line (viewDirection.y close to 0 if up is (0,1,0))
          horizonSmoothFactor *= (1.0 - smoothstep(0.0, 0.3, abs(dot(viewDirection, up))));
          skyColor = mix(skyColor, horizonColor, horizonSmoothFactor * 0.7);

          // Ensure color is not negative
          skyColor = max(skyColor, vec3(0.0));

          // Gamma correction (simplified)
          skyColor = pow(skyColor, vec3(1.0/2.2));

          // Calculate final opacity based on sun elevation for night transparency
          float finalOpacity = clamp(uBaseOpacity * dayFactor, 0.0, uBaseOpacity); // Ensure clamped range

          gl_FragColor = vec4(skyColor, finalOpacity);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
    });

    return material;
  }, [baseOpacity, observerSunElevationFactor]); 

  // Use useFrame from @react-three/fiber
  useFrame(({ camera }: { camera: THREE.Camera }) => {
    if (skyRef.current && skyMaterial) {
      const sunDirNormalized = new THREE.Vector3().copy(sunPosition).normalize();
      skyMaterial.uniforms.sunPosition.value.copy(sunDirNormalized);
      skyMaterial.uniforms.uBaseOpacity.value = baseOpacity; 
      skyMaterial.uniforms.uObserverSunElevationFactor.value = observerSunElevationFactor; 
    }
  });

  return (
    <mesh ref={skyRef} material={skyMaterial}>
      <sphereGeometry args={[skyRadius, 64, 32]} />
    </mesh>
  );
};

export default SkyDome; 