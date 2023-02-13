import { useLoader } from '@react-three/fiber'
import { Clone, useGLTF } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Burger } from './model/burger'

const burger = './hamburger.glb'
const helmet = './FlightHelmet/glTF/FlightHelmet.gltf'

const Model = () => {

  // The hard way
  // const model = useLoader(GLTFLoader, burger,
  // // Draco way of adding (hard way)
  // (loader) => {
  //     // console.log(loader)
  //     const dracoLoader = new DRACOLoader()
  //     dracoLoader.setDecoderPath('./draco/')
  //     loader.setDRACOLoader(dracoLoader)
  // })

  // The easy way
  const model = useGLTF(burger)

  return <>
    <Clone object={ model.scene } scale={ 0.2 } position-y={ 0.5 } />
    <Clone object={ model.scene } scale={ 0.2 } position-x={ -2.25 } position-y={ -1 } rotation-y={ 0.5 } />
    <Clone object={ model.scene } scale={ 0.2 } position-x={ -1.83 } position-z={ -2 } position-y={ -1 } rotation-y={ 0.1 } />
    <Burger scale={ 0.30 } position-y={ -1 } rotation-y={ 0.35 } />
    {/* <primitive object={ model.scene } scale={ 0.2 } position-y={ -1 } /> */}
  </>
}

// Not necessary. Read the documentation what preload does.
useGLTF.preload(burger)

export default Model