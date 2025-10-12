import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import type React from "react";
import { useEffect, useRef } from "react";

interface VerticalThreadsProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
  rotation?: number;
  threadCount?: number;
  threadLength?: number;
  threadWidth?: number;
  offsetX?: number;
  offsetY?: number;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform float uRotation;
uniform float uThreadLength;
uniform float uThreadWidth;
uniform int uThreadCount;
uniform vec2 uOffset;

#define PI 3.1415926538

const int u_line_count = 15;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float verticalLineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance, float threadLength) {
    float scaledWidth = max(width * (iResolution.y / 1080.0) * 2.0, width * 1.5);
    float finalAmplitude = amplitude * (1.0 + (mouse.x - 0.5) * 0.2);
    float time_scaled = time / 5.0 + (mouse.y - 0.5) * 1.0;
    
    float ynoise = Perlin2D(vec2(perc * 3.0, time_scaled + st.y * 2.0)) * 0.5;
    
    float x = 0.1 + perc * 1.6 + ynoise * finalAmplitude * 0.03;
    
    float centerY = 0.48;
    float halfLength = threadLength * 0.5;
    
    if (st.y < centerY - halfLength || st.y > centerY + halfLength) {
        return 0.0;
    }

    float line_start = smoothstep(
        x + (scaledWidth / 2.0),
        x,
        st.x
    );

    float line_end = smoothstep(
        x,
        x - (scaledWidth / 2.0),
        st.x
    );

    return clamp(line_start - line_end, 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    // Apply offset
    uv += uOffset;
    
    // Rotate UV coordinates based on uRotation uniform
    vec2 center = vec2(0.5);
    uv -= center;
    float angle = uRotation;
    float cosA = cos(angle);
    float sinA = sin(angle);
    mat2 rotation = mat2(cosA, -sinA, sinA, cosA);
    uv = rotation * uv;
    uv += center;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count - 1);
        line_strength *= (1.0 - verticalLineFn(
            uv,
            uThreadWidth * pixel(1.0, iResolution.xy),
            p,
            (PI * 1.0) * p + uDistance * float(i),
            uMouse,
            iTime,
            uAmplitude,
            uDistance,
            uThreadLength
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const VerticalThreads: React.FC<VerticalThreadsProps> = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  rotation = 0,
  threadCount = 15,
  threadLength = 0.6,
  threadWidth = 2.0,
  offsetX = 0,
  offsetY = 0,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uRotation: { value: rotation },
        uThreadLength: { value: threadLength },
        uThreadWidth: { value: threadWidth },
        uThreadCount: { value: threadCount },
        uLineCount: { value: threadCount },
        uOffset: { value: new Float32Array([offsetX, offsetY]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms.iResolution.value.r = clientWidth;
      program.uniforms.iResolution.value.g = clientHeight;
      program.uniforms.iResolution.value.b = clientWidth / clientHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    function handleMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }
    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }
    if (enableMouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    function update(t: number) {
      if (enableMouseInteraction) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }
      program.uniforms.iTime.value = t * 0.001;

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    }
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", resize);

      if (enableMouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color,
    amplitude,
    distance,
    enableMouseInteraction,
    rotation,
    threadCount,
    threadLength,
    threadWidth,
    offsetX,
    offsetY,
  ]);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" {...rest} />;
};

export default VerticalThreads;
