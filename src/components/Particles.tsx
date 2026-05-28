import type React from "react";
import { useEffect, useRef } from "react";

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  svgType: string;
}

const defaultColors: string[] = ["#000000"];

const svgArray = [
  `<svg fill="currentColor"  id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
width="800px" height="800px" viewBox="0 0 254.83 254.831">
<g>
<path d="M224.774,178.355V42.865V13.753V0L79.044,52.499v8.223v35.325v99.319c-4.5-2.004-9.528-3.159-14.867-3.159
c-18.84,0-34.121,14.018-34.121,31.312s15.281,31.312,34.121,31.312c18.191,0,33.013-13.059,34.036-29.51h0.101V89.015
l107.192-39.116v98.496c-4.51-1.999-9.532-3.159-14.871-3.159c-18.833,0-34.119,14.022-34.119,31.317
c0,17.29,15.286,31.307,34.119,31.307c18.196,0,33.016-13.059,34.041-29.505H224.774z"/>
</g>
</svg>`,
  `<svg fill="currentColor" height="800px" width="800px" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 512 512">
    <g>
      <g>
        <path d="M349.863,87.125c-57.579-25.237-72.939-70.357-73.515-72.128c-0.128-0.363-0.384-0.64-0.533-1.003
			c-0.405-1.088-0.981-2.005-1.557-2.987c-0.768-1.365-1.536-2.645-2.539-3.776c-0.704-0.789-1.493-1.408-2.304-2.091
			c-1.237-1.024-2.496-1.92-3.925-2.645c-0.917-0.469-1.835-0.811-2.816-1.152c-1.579-0.512-3.157-0.832-4.843-0.96
			C257.17,0.32,256.637,0,255.975,0c-0.512,0-0.939,0.256-1.429,0.299c-0.597,0.021-1.173-0.149-1.792-0.064
			c-1.024,0.171-1.899,0.704-2.88,1.003c-1.088,0.32-2.155,0.597-3.157,1.088c-1.429,0.683-2.645,1.621-3.861,2.603
			c-0.832,0.64-1.685,1.195-2.411,1.963c-1.152,1.237-1.984,2.709-2.837,4.203c-0.448,0.811-1.024,1.472-1.387,2.325
			c-0.981,2.475-1.579,5.12-1.579,7.915v128V320h-64c-48.661,0-85.333,42.069-85.333,97.835c0,51.925,42.24,94.165,94.165,94.165
			h12.459c51.84,0,85.376-33.493,85.376-85.333v-85.333V172.715c57.877,10.133,113.621,56.405,114.24,56.939
			c3.925,3.285,8.811,5.013,13.76,5.013c2.859,0,5.739-0.576,8.469-1.771c7.424-3.221,12.395-10.347,12.843-18.432
			C426.791,210.731,430.546,122.496,349.863,87.125z"/>
      </g>
    </g>
  </svg>`,
  `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="12.000000"
    height="7.0000000"
    id="svg1361">
    <g
      id="layer1">
      <g
        transform="translate(-199.3990,-536.4730)"
        style="fill:#000000;fill-opacity:1.0000000"
        id="g2912">
        <path
          d="M 206.04921,542.89329 C 204.33221,542.80244 202.99047,541.27833 202.45208,539.70226 C 202.12589,538.77722 202.30505,537.38950 203.39174,537.12966 C 204.96615,536.86226 206.27260,538.19967 207.00481,539.47953 C 207.52641,540.42880 207.81478,541.92368 206.83679,542.67615 C 206.60458,542.83188 206.32387,542.89434 206.04921,542.89329 z M 208.78446,537.49000 C 206.85001,536.31510 204.40641,536.22358 202.28813,536.88110 C 200.94630,537.35025 199.41169,538.34823 199.39900,539.97250 C 199.39807,541.56396 200.87900,542.55675 202.18949,543.02959 C 204.26418,543.70824 206.65796,543.64856 208.59501,542.56669 C 209.69149,541.98333 210.66334,540.77535 210.33379,539.43643 C 210.15258,538.57546 209.49304,537.93123 208.78446,537.49000 z "
          style="fill:#000000;fill-opacity:1.0000000"
          id="path2918" />
      </g>
    </g>
  </svg>`,
  `<svg height="800px" width="800px" id="_x32_" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 512 512">
    <g>
      <path class="st0" d="M403.238,44.309c-33.18,29.026-94.297,79.014-159.843,88.165c4.638-11.244,7.23-23.546,7.23-36.474
		c0-53.016-42.984-96-96-96c-53.016,0-96.001,42.984-96.001,96s42.984,96.001,96.001,96.001
		c49.221,4.921,125.528,2.46,214.156-68.934L159.546,507.069L250.625,512c0,0,196.922-438.154,201.834-452.927
		C457.39,44.309,442.627,9.852,403.238,44.309z"/>
    </g>
  </svg>`,
  `<svg height="800px" width="800px" id="_x32_" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 512 512" >
    <g>
      <path class="st0" d="M349.091,371.859c-14.588-11.448-44.397-43.31-65.554-102.28c-20.802-57.964,25.648-94.268,50.571-113.841
		c6.486-5.102,7.92-11.556-0.692-20.531C324.82,126.241,219.343,9.028,219.343,9.028c-13.03-17.143-30.816-7.13-20.604,7.302
		c120.65,170.544-35.068,196.638-35.068,196.638s16.854,43.837,97.392,115.062c-84.28-21.915-138.6,40.178-97.392,104.108
		c41.2,63.923,120.798,77.62,127.358,79.45c7.261,2.02,17.794-3.659,6.561-10.953c-25.566-16.623-78.667-60.732-53.381-92.24
		c33.716-42.008,83.348-23.744,96.452-17.358C363.44,402.147,371.574,389.52,349.091,371.859z"/>
    </g>
  </svg>`,
  `<svg fill="#000000" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
       width="800px" height="800px" viewBox="0 0 276.164 276.164"
  >
    <g>
      <path d="M156.716,61.478c-4.111,6.276-8.881,11.511-14.212,15.609l-8.728,6.962c-13.339,11.855-22.937,21.433-28.542,28.464
		c-10.209,12.788-15.806,25.779-16.65,38.611c-0.942,14.473,3.187,28.21,12.275,40.84c9.636,13.458,21.8,20.754,36.164,21.69
		c3.291,0.218,6.897,0.182,9.896-0.015l-1.121-10.104c-2.09,0.192-4.306,0.223-6.628,0.068c-9.437-0.617-17.864-4.511-25.064-11.573
		c-7.524-7.333-10.895-15.415-10.287-24.7c1.149-17.59,12.562-35.004,33.925-51.792l9.543-7.599
		c8.394-7.174,15.192-16.191,20.216-26.825c4.971-10.556,7.886-21.983,8.673-33.96c0.466-7.037-0.513-15.775-2.874-25.965
		c-3.241-13.839-7.854-20.765-14.136-21.179c-2.232-0.138-4.676,0.986-7.658,3.617c-7.252,6.548-12.523,14.481-15.683,23.542
		c-2.438,6.926-4.057,16.189-4.805,27.529c-0.313,4.72,0.313,13.438,1.805,23.962l8.844-8.192c-0.028-1.183,0.005-2.413,0.096-3.703
		c0.466-7.221,2.289-15.062,5.394-23.293c3.956-10.296,7.689-13.409,10.133-14.204c0.668-0.218,1.32-0.298,2.015-0.254
		c3.185,0.212,6.358,1.559,5.815,9.979C164.664,46.132,161.831,53.693,156.716,61.478z"/>
      <path d="M164.55,209.161c5.728-2.568,10.621-6.478,14.576-11.651c5.055-6.561,7.897-14.316,8.467-23.047
		c0.72-10.719-1.854-20.438-7.617-28.895c-6.322-9.264-14.98-14.317-25.745-15.026c-1.232-0.081-2.543-0.075-3.895,0.025
		l-2.304-17.191l-9.668,7.112l1.483,12.194c-5.789,2.393-10.827,6.17-15.017,11.255c-4.823,5.924-7.508,12.443-7.964,19.382
		c-0.466,7.208,1.142,13.81,4.782,19.583c1.895,3.081,4.507,5.82,7.498,8.058c4.906,3.65,10.563,3.376,11.459,1.393
		c0.906-1.983-2.455-5.095-5.09-9.248c-1.502-2.351-2.242-5.173-2.242-8.497c0-7.053,4.256-13.116,10.317-15.799l5.673,44.211
		l1.325,10.258c0.864,4.873,1.719,9.725,2.537,14.52c1,6.488,1.352,12.112,1.041,16.715c-0.419,6.375-2.408,11.584-5.919,15.493
		c-2.234,2.485-4.844,4.055-7.795,4.925c3.961-3.962,6.414-9.43,6.414-15.478c0-12.075-9.792-21.872-21.87-21.872
		c-3.353,0-6.491,0.812-9.329,2.159c-0.36,0.155-0.699,0.388-1.054,0.574c-0.779,0.425-1.559,0.85-2.286,1.362
		c-0.249,0.187-0.487,0.403-0.732,0.605c-4.888,3.816-8.091,9.616-8.375,16.229c0,0.01-0.011,0.021-0.011,0.031
		c0,0.005,0,0.01,0,0.016c-0.013,0.311-0.09,0.59-0.09,0.896c0,0.259,0.067,0.492,0.078,0.74
		c-0.011,7.084,2.933,13.179,8.839,18.118c5.584,4.666,12.277,7.28,19.892,7.777c4.327,0.28,8.505-0.217,12.407-1.485
		c3.189-1.041,6.275-2.62,9.149-4.687c6.96-5.022,10.75-11.584,11.272-19.532c0.399-6.063,0.094-13.235-0.937-21.411l-2.838-18.429
		l-7.156-52.899c7.984,1.532,14.027,8.543,14.027,16.968c0,5.986-1.937,15.431-5.551,20.376L164.55,209.161z"/>
    </g>
  </svg>`,
  `<svg height="800px" width="800px" id="_x32_" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 512 512">
    <g>
      <path class="st0" d="M176.014,0l-2.823,0.01C89.091,1.164,20.78,63.557,15.904,118.564c-3.125,35.072,4.693,63.941,22.568,83.494
		c16.307,17.803,39.765,26.836,69.727,26.836c31.095,0,61.603-29.77,61.603-60.106c0-30.803-25.076-55.869-55.888-55.869
		c-16.569,0-27.575,7.323-34.858,12.179c-2.853,1.892-5.796,3.854-7.121,3.854c-0.446,0-1.477-1.184-2.458-5.635
		c-3.399-15.335,1.902-33.644,14.212-48.98c10.399-12.978,34.858-34.726,81.876-34.726c65.67,0,101.833,52.894,101.833,148.952
		c0,192.852-165.703,271.845-216.483,291.459c-10.398,4.016-13.778,12.716-12.492,19.553C39.828,507.002,45.947,512,53.686,512
		c2.448,0,5.037-0.496,7.657-1.477l5.807-2.165C262.916,435.82,362.19,326.247,362.19,182.648C362.19,57.164,265.688,0,176.014,0z"
      />
      <path class="st0" d="M455.486,126.84c22.771,0,41.282-18.522,41.282-41.292c0-22.76-18.512-41.271-41.282-41.271
		c-22.759,0-41.281,18.511-41.281,41.271C414.205,108.318,432.726,126.84,455.486,126.84z"/>
      <path class="st0" d="M455.486,211.365c-22.759,0-41.281,18.522-41.281,41.282c0,22.77,18.522,41.281,41.281,41.281
		c22.771,0,41.282-18.511,41.282-41.281C496.768,229.887,478.256,211.365,455.486,211.365z"/>
    </g>
  </svg>`,
];

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  disableRotation = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);

      const r = Math.cbrt(Math.random());

      return {
        x: x * r * particleSpread,
        y: y * r * particleSpread,
        z: z * r * particleSpread,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: particleBaseSize * (1 + sizeRandomness * (Math.random() - 0.5)),
        color: palette[Math.floor(Math.random() * palette.length)],
        svgType: svgArray[Math.floor(Math.random() * svgArray.length)],
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) * 0.001 * speed;
      lastTime = currentTime;

      // Clear container
      container.innerHTML = "";

      // Update and render particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx * deltaTime * 100;
        particle.y += particle.vy * deltaTime * 100;
        particle.z += particle.vz * deltaTime * 100;

        // Update rotation
        if (!disableRotation) {
          particle.rotation += particle.rotationSpeed * deltaTime * 100;
        }

        // Apply mouse interaction
        let displayX = particle.x;
        let displayY = particle.y;

        if (moveParticlesOnHover) {
          displayX += mouseRef.current.x * particleHoverFactor * 50;
          displayY += mouseRef.current.y * particleHoverFactor * 50;
        }

        // Create SVG element
        const svgElement = document.createElement("div");
        svgElement.innerHTML = particle.svgType;
        const svg = svgElement.firstElementChild as SVGElement;

        if (svg) {
          const containerRect = container.getBoundingClientRect();
          const centerX = containerRect.width / 2;
          const centerY = containerRect.height / 2;

          // Calculate pixel positions based on particle position
          const pixelX = centerX + displayX * 10;
          const pixelY = centerY + displayY * 10;

          svg.style.position = "absolute";
          svg.style.left = `${pixelX}px`;
          svg.style.top = `${pixelY}px`;
          svg.style.width = `${particle.size / 10}px`;
          svg.style.height = `${particle.size / 10}px`;
          svg.style.transform = `translate(-50%, -50%) rotate(${particle.rotation}rad)`;
          svg.style.color = particle.color;
          svg.style.opacity = alphaParticles ? "0.6" : "1";
          svg.style.pointerEvents = "none";
          svg.style.zIndex = Math.floor(particle.z + 100).toString();

          container.appendChild(svg);
        }

        // Wrap around boundaries
        if (Math.abs(particle.x) > particleSpread * 2) {
          particle.x = -Math.sign(particle.x) * particleSpread * 2;
        }
        if (Math.abs(particle.y) > particleSpread * 2) {
          particle.y = -Math.sign(particle.y) * particleSpread * 2;
        }
        if (Math.abs(particle.z) > particleSpread * 2) {
          particle.z = -Math.sign(particle.z) * particleSpread * 2;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    disableRotation,
    particleColors,
  ]);

  return <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`} />;
};

export default Particles;
