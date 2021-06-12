import { Vector3 } from "three";

// Force per distance
const REPULSION_FORCE: number = -0.2;

const EDGE_FORCE: number = 0.1;

export default function calculateForces(
  nodes: THREE.Mesh[],
  edges: number[][],
  timeDelta: number
) {
  for (let i = 0; i < nodes.length; i++) {
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

      if (distanceVector.length() < 10) {
        let repulsion = REPULSION_FORCE / distanceVector.length();
        let repulsionVector = new Vector3()
          .copy(distanceVector)
          .multiplyScalar(repulsion * timeDelta);

        if (repulsionVector.length() > 0.0001) {
          node.position.add(repulsionVector);
        }
      }

      let attraction = edges[i][j] * EDGE_FORCE * distanceVector.length();

      let attractionVector = new Vector3()
        .copy(distanceVector)
        .multiplyScalar(attraction * timeDelta);

      if (attractionVector.length() > 0.0001) {
        node.position.add(attractionVector);
      }
    }
  }
}
