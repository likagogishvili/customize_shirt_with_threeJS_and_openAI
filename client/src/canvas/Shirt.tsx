import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useSnapshot } from "valtio";
import state from "../store";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

interface ShirtGLTF extends GLTF {
  nodes: {
    T_Shirt_male: THREE.Mesh;
    // Add other nodes as needed
  };
  materials?: {
    lambert1?: THREE.Material;
    // Add other materials as needed
  };
}

function Shirt() {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF(
    "/shirt_baked.glb"
  ) as unknown as ShirtGLTF;
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) => {
    const lambert1Material = materials?.lambert1 as
      | THREE.MeshStandardMaterial
      | undefined;

    if (lambert1Material) {
      easing.dampC(lambert1Material.color, snap.color, 0.25, delta);
    }
  });
  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials?.lambert1}
        material-roughness={1}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            depthTest={false}
          />
        )}
      </mesh>
    </group>
  );
}

export default Shirt;
