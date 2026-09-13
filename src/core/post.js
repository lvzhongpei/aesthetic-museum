import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * 后处理链：场景 → 泛光辉光 → 色调映射/色彩空间 → 电影调色
 *
 * 调色放在 OutputPass 之后，是在 sRGB 显示空间里做颗粒与暗角——
 * 那才是它们该待的地方（线性空间里做颗粒会脏，暗角也会失形）。
 */

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAmount: { value: 1 },
    uVignette: { value: 0.42 },
    uGrain: { value: 0.032 },
    uCA: { value: 0.5 },
    uTransition: { value: 0 },
    uTint: { value: new THREE.Color('#ffffff') },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAmount;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uCA;
    uniform float uTransition;
    uniform vec3 uTint;
    uniform vec2 uResolution;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);

      // 径向色散：越靠边越明显，切展区时整体放大一档
      float ca = (uCA + uTransition * 1.6) * uAmount;
      vec2 dir = normalize(c + 1e-6) * r2 * ca * 0.008;
      vec3 col;
      col.r = texture2D(tDiffuse, uv - dir).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv + dir).b;

      // 暗角：过渡中收紧，像走过一道门
      float vig = 1.0 - (uVignette + uTransition * 0.42) * smoothstep(0.12, 0.82, r2 * 2.0);
      col *= vig;

      // 过渡染色：下一间展室的光先一步漫进来
      col += uTint * uTransition * 0.05;

      // 胶片颗粒
      float g = hash(uv * uResolution + fract(uTime * 0.7) * 311.0) - 0.5;
      col += g * uGrain * uAmount;

      // 轻微提对比与饱和
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, 1.06);
      col = (col - 0.5) * 1.05 + 0.5;

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `,
};

export function createPost(renderer, scene, camera, tier) {
  const dpr = renderer.getPixelRatio();
  const w = Math.floor(window.innerWidth * dpr);
  const h = Math.floor(window.innerHeight * dpr);

  // 自定义渲染目标：WebGL2 下要显式开 samples 才有 MSAA，
  // 否则用了 composer 之后边缘会明显发毛。
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType,
    samples: tier.low ? 0 : 4,
  });

  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(w, h),
    tier.low ? 0.4 : 0.62, // strength
    tier.low ? 0.42 : 0.58, // radius
    0.78, // threshold
  );
  composer.addPass(bloom);

  composer.addPass(new OutputPass());

  const grade = new ShaderPass(GradeShader);
  grade.uniforms.uAmount.value = tier.low ? 0.55 : 1;
  grade.uniforms.uGrain.value = tier.low ? 0.018 : 0.032;
  grade.uniforms.uResolution.value.set(w, h);
  composer.addPass(grade);
  grade.renderToScreen = true;

  return {
    composer,
    bloom,
    grade,
    render(dt) {
      grade.uniforms.uTime.value += dt;
      composer.render(dt);
    },
    setTransition(v, tint) {
      grade.uniforms.uTransition.value = v;
      if (tint) grade.uniforms.uTint.value.set(tint);
    },
    setBloom(strength) {
      bloom.strength = strength;
    },
    resize() {
      const d = renderer.getPixelRatio();
      const W = window.innerWidth;
      const H = window.innerHeight;
      composer.setSize(Math.floor(W * d), Math.floor(H * d));
      bloom.setSize(Math.floor(W * d), Math.floor(H * d));
      grade.uniforms.uResolution.value.set(Math.floor(W * d), Math.floor(H * d));
    },
  };
}

export default createPost;
