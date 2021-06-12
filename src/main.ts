import * as THREE from "three";
import { BufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { randFloat } from "three/src/math/MathUtils";
import calculateForces from "./force";
import "./style.css";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera - similar to human eye
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Using orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// moving camera away
camera.position.z = -15;

controls.update();

// Adding the render element
document.body.appendChild(renderer.domElement);

// Adding a geometry to use for every dot we add
const dotGeometry = new THREE.SphereGeometry(0.25, 24, 24);

let nodes: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>[] = [];
let lines: THREE.Line[] = [];

function createEdges(n: number) {
  const edges = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      // const isEdge = randFloat(0, 1) > 0.95 && i !== j ? 1 : 0;
      const isEdge = i % 53 == j % 53 ? 1 : 0;
      // const isEdge = Math.abs(i - j) < 2 ? 1 : 0;
      row.push(isEdge);
    }
    edges.push(row);
  }

  return edges;
}

const numberOfNodes = 200;
const material = new THREE.MeshStandardMaterial({ color: 0xabff00 });

// Adding some rendomly placed dots
for (let i = 0; i < numberOfNodes; i++) {
  let dot = new THREE.Mesh(dotGeometry, material);
  dot.translateX(randFloat(-0.5, 0.5));
  dot.translateY(randFloat(-0.5, 0.5));
  dot.translateZ(randFloat(-0.5, 0.5));
  nodes.push(dot);
  scene.add(dot);
}

let edges = createEdges(numberOfNodes);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00f0 });

let hasLines = false;

function drawLines() {
  let k = 0;
  for (let i = 0; i < numberOfNodes; i++) {
    for (let j = 0; j < numberOfNodes; j++) {
      if (edges[i][j] === 1) {
        let fromNode = nodes[i];
        let toNode = nodes[j];
        let vectorStart = fromNode.position;
        let vectorEnd = toNode.position;

        let line;

        if (!hasLines) {
          line = new THREE.Line(new BufferGeometry(), lineMaterial);
          lines.push(line);
          scene.add(line);
        } else {
          line = lines[k];
        }
        line.geometry.setFromPoints([vectorStart, vectorEnd]);

        k++;
      }
    }
  }
}

// Setting up lighting
const pointLight = new THREE.PointLight(0x404040);
pointLight.position.set(-20, 20, -20);
scene.add(pointLight);

// setup global light
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

drawLines();

hasLines = true;

let i = 0;

// Animation loop
function animate() {
  calculateForces(nodes, edges, 0.001);
  drawLines();

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start animation loop
animate();
