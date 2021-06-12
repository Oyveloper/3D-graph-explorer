import { Vector3 } from "three";

// Force per distance
const REPULSION_FORCE: number = -0.2;

const EDGE_FORCE: number = 0.4;
const SIGMA: number = 0.08;
const GRAVITY: number = 0.0002;
let forceVectors: Vector3[] = [];

export default function calculateForces(
  nodes: THREE.Mesh[],
  edges: number[][],
  t: number
) {
  forceVectors = [];

  for (let i = 0; i < nodes.length; i++) {
    let forceVector = new Vector3();

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) {
        continue;
      }
      let node = nodes[i];
      let otherNode = nodes[j];

      let otherNodePosition = new Vector3(
        otherNode.position.x,
        otherNode.position.y,
        otherNode.position.z
      );

      let distanceVector = new Vector3()
        .copy(otherNodePosition)
        .sub(node.position);

      if (edges[i][j] === 1) {
        // Attraction
        let attraction = EDGE_FORCE * Math.log(distanceVector.length() / 3);

        let attractionVector = new Vector3()
          .copy(distanceVector)
          .multiplyScalar(attraction);

        forceVector.add(attractionVector);
      } else {
        // repulsion
        if (distanceVector.length() < 6) {
          let repulsion = REPULSION_FORCE / distanceVector.length() ** 2;
          let repulsionVector = new Vector3()
            .copy(distanceVector)
            .multiplyScalar(repulsion);

          forceVector.add(repulsionVector);
        }
      }

      // gravitation
      let gravityVector = new Vector3()
        .copy(node.position)
        .multiplyScalar(-GRAVITY);
      forceVector.add(gravityVector);
    }

    forceVectors.push(forceVector);
  }

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].position.add(
      forceVectors[i].multiplyScalar(SIGMA / Math.max(1, Math.log(t)))
    );
  }
}
