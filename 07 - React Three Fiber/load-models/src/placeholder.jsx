import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const Placeholder = (props) => {
  return <>
    <mesh { ...props } >
        <boxGeometry args={ [1, 1, 1, 2, 2, 2] }></boxGeometry>
        <meshBasicMaterial wireframe color={ 'orange' }></meshBasicMaterial>
    </mesh>
  </>
}


export default Placeholder