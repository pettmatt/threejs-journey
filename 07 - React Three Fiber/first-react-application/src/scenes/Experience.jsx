import { useThree, extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CustomObject from '../objects/customObject'

extend({ OrbitControls })

const Experience = () => {
  // Through three variable we can pass the camera to our controls -> const three = useThree()
  // To get easier access to the part of three library we can target the part we need with { featureName }
  // gl contains details about the dom element that is also needed to operate the controls
  const { camera, gl } = useThree()
  const cube = useRef()
  // console.log(camera, gl.domElement)

  // Using state to update the wanted attribute is valid way (it works),
  // but it will have worse performance than what is used here (directly changing the attribute value).
  // For animations it's a bad way.
  // Delta is short for delta time
  useFrame((state, delta) => {
    // console.log('tick')
    const angle = state.clock.elapsedTime
    state.camera.position.x = Math.sin(angle) * 8
    state.camera.position.z = Math.cos(angle) * 8
    state.camera.lookAt(0, 0, 0)

    cube.current.rotation.y += delta * 0.75
  })

  return ( 
    <>
      <orbitControls args={ [camera, gl.domElement] } />

      <directionalLight position={ [1, 2, 3] } intensity={ 1.5 } />
      <ambientLight intensity={ 0.5 } />

      {/* <mesh scale={ [0.5,0.3,0.5] }>
        <sphereGeometry args={ [2, 32, 32] } />
        <meshBasicMaterial color='red' wireframe />
      </mesh> */}

      <group>
        <mesh scale={ 1.5 } position-x={ -3 }>
          <sphereGeometry />
          <meshBasicMaterial color='orange' />
        </mesh>

        <mesh ref={ cube } scale={ 1.5 } position-x={ 3 } position-y={ -0.6 }>
          <boxGeometry />
          <meshBasicMaterial color='mediumpurple' />
        </mesh>
      </group>

      <mesh scale={ 10 } position-y={ -1.6 } rotation-x={ - Math.PI * 0.5 }>
        <planeGeometry />
        <meshBasicMaterial color='greenyellow' />
      </mesh>

      <CustomObject />
    </>
  )
}

export default Experience