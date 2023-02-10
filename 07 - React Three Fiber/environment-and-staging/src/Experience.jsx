import { useFrame } from '@react-three/fiber'
import { ContactShadows, RandomizedLight, AccumulativeShadows, softShadows, BakeShadows, useHelper, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useControls } from 'leva'

// Blurring the shadows making them "soft"
// In drei, there is also an option to use softShadows as components
softShadows({
    frustum: 3.75,
    size: 0.005,
    near: 9.5,
    samples: 17,
    rings: 11
})

export default function Experience()
{
    // Reminder that helper is just a visualizer that helps to understand where the light is and where it is pointing at.
    const directionalLight = useRef()
    // useHelper( theObject, theThreeHelpher, size )
    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    const cube = useRef()
    
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime
        cube.current.position.x = 2 + Math.sin(time)
        cube.current.rotation.y += delta * 0.2
    })

    const { color, opacity, blur } = useControls('contact shadows', {
        color: '#000000',
        opacity: { value: 0.5, min: 0, max: 1 },
        blur: { value: 0.7, min: 0, max: 1 }
    })

    return <>

        {/* Bakes shadows, making them static. Lower render time. */}
        {/* <BakeShadows /> */}

        {/* Example */}
        {/* <SoftShadows
            frustum={ 3.75 }
            size={ 0.005 }
            near={ 9.5 }
            samples={ 17 }
            rings={ 11 }
        /> */}

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <AccumulativeShadows
            position={ [0, -0.99, 0] }
            scale={ 10 }
            color='#316d39'
            opacity={ 0.8 }
            frames={ Infinity }
            temporal // Makes sure that the frames are simulated steadily over time
            blend={ 100 } // Fixes the "artistic" shadow to being it smoother
        >
            <RandomizedLight 
                amount={ 8 }
                radius={ 1 }
                ambient={ 0.5 }
                intensity={ 1 }
                position={ [1, 2, 3] }
                bias={ 0.001 }
            />
        </AccumulativeShadows> */}

        <ContactShadows 
            position={ [0, -0.99, 0] }
            scale={ 10 }
            resolution={ 512 }
            far={ 4 }
            color={ color }
            opacity={ opacity }
            blur={ blur }
            frames={ 1 } // renders once baking the shadow
        />

        {/* Light can cast shadows */}
        <directionalLight ref={ directionalLight } 
            castShadow 
            position={ [ 1, 2, 3 ] } 
            intensity={ 1.5 }
            shadow-mapSize={ [1024, 1024] }
            shadow-camera-far={ 10 }
            shadow-camera-near={ 1 }
            shadow-camera-top={ 5 }
            shadow-camera-right={ 5 }
            shadow-camera-bottom={ -5 }
            shadow-camera-left={ -5 } />
        <ambientLight intensity={ 0.5 } />

        {/* Light can cast shadows */}
        <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh ref={ cube } castShadow position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        {/* Shadow can be casted to this object with "receiveShadow" attribute */}
        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}