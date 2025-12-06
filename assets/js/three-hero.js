// 3D hero using Three.js — performant, animated wireframe sphere with gradient lighting
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

console.log('Script loaded');


(function initThreeHero() {

  const container = document.getElementById('three-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  container.appendChild(renderer.domElement);

  const sphereGeom = new THREE.SphereGeometry(2.2, 64, 64);
  const sphereMat = new THREE.MeshPhongMaterial({ wireframe: true });
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);
  scene.add(sphere);

  const ambient = new THREE.AmbientLight(0x555555);
  const point = new THREE.PointLight(0xff3c00, 1.2);
  point.position.set(5, 4, 6);
  scene.add(ambient, point);

  const mouse = { x: 0, y: 0 };
  container.addEventListener('pointermove', e => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  });

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.004 + mouse.y * 0.002;
    sphere.rotation.y += 0.006 + mouse.x * 0.002;

    // cycle color over time
    const t = Date.now() * 0.0005; // time factor
    const hue = (t % 1);           // value between 0–1
    sphereMat.color.setHSL(hue, 1, 0.5);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  console.log(camera.position);
  console.log(sphere.position);
})();



