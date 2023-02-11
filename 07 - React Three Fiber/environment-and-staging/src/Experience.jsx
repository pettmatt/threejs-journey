import { useFrame } from '@react-three/fiber'
import { Stage, Lightformer, Environment, Sky, ContactShadows, RandomizedLight, AccumulativeShadows, softShadows, BakeShadows, useHelper, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import * as THREE from 'three'

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

    const { sunPosition } = useControls('sky', {
        sunPosition: { values: [1, 2, 3] }
    })

    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls('environment map', {
        envMapIntensity: { value: 1, min: 0, max: 12 },
        envMapHeight: { value: 7, min: 0, max: 100 },
        envMapRadius: { value: 20, min: 10, max: 1000 },
        envMapScale: { value: 100, min: 10, max: 1000 },
    })

    return <>

        {/* <Environment 
            background
            // files={ './environmentMaps/the_sky_is_on_fire_2k.hdr' } 
            preset='sunset'
            ground={{
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapScale
            }}
        >
            <color args={ ['#000000'] } attach='background' />
            <Lightformer position-z={ -5 } scale={ 10 } color='red' intensity={ 10 } form='ring' />

            {/* <mesh position-z={ -5 } scale={ 10 }>
                <planeGeometry />
                <meshBasicMaterial color={ [30, 0, 0] } />
            </mesh> */}
        {/* </Environment> */}

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

        {/* <ContactShadows 
            position={ [0, -0.99, 0] }
            scale={ 10 }
            resolution={ 512 }
            far={ 4 }
            color={ color }
            opacity={ opacity }
            blur={ blur }
            frames={ 1 } // renders once baking the shadow
        /> */}

        {/* Light can cast shadows */}
        {/* <directionalLight ref={ directionalLight } 
            castShadow 
            position={ sunPosition } 
            intensity={ 1.5 }
            shadow-mapSize={ [1024, 1024] }
            shadow-camera-far={ 10 }
            shadow-camera-near={ 1 }
            shadow-camera-top={ 5 }
            shadow-camera-right={ 5 }
            shadow-camera-bottom={ -5 }
            shadow-camera-left={ -5 } /> */}
        {/* <ambientLight intensity={ 0.5 } /> */}

        {/* <Sky sunPosition={ sunPosition } /> */}

        {/* Light can cast shadows */}
        {/* <mesh castShadow position-x={ - 2 } position-y={ 1 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={ envMapIntensity } />
        </mesh>

        <mesh ref={ cube } castShadow position-x={ 2 } position-y={ 1 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" envMapIntensity={ envMapIntensity } />
        </mesh> */}

        {/* Shadow can be casted to this object with "receiveShadow" attribute */}
        {/* <mesh position-y={ 0 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" envMapIntensity={ envMapIntensity } />
        </mesh> */}


        <Stage shadows={ { type: 'contact', opacity: 0.4, blur: 3 } }>
            <mesh castShadow position-x={ - 2 } position-y={ 1 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" envMapIntensity={ envMapIntensity } />
            </mesh>

            <mesh ref={ cube } castShadow position-x={ 2 } position-y={ 1 } scale={ 1.5 }>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" envMapIntensity={ envMapIntensity } />
            </mesh>
        </Stage>
    </>
}