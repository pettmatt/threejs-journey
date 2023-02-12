import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const Model = () => {
  const burger = useLoader(GLTFLoader, './hamburger.glb', 
  // Draco way of adding (hard way)
  (loader) => {
      // console.log(loader)
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('./draco/')
      loader.setDRACOLoader(dracoLoader)
  })

  const helmet = useLoader(GLTFLoader, './FlightHelmet/glTF/FlightHelmet.gltf', 
  // Draco way of adding (hard way)
  (loader) => {
      // console.log(loader)
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('./draco/')
      loader.setDRACOLoader(dracoLoader)
  })

  return <>
    <primitive object={ helmet.scene } scale={ 3 } position-y={ -1 } />
    {/* Hard way of adding a model to a scene */}
    {/* <primitive object={ burger.scene } scale={ 0.35 } /> */}
  </>
}


export default Model