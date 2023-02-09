import { Float, Html, OrbitControls, TransformControls, PivotControls, Text, MeshReflectorMaterial } from '@react-three/drei'
import { useRef } from 'react'

// Drei is library that includes a lot of ready to use components,
// which means that there is less writing on the basic stuff.

// Troika is awesome library that is used to implement text in 3D space,
// which can be then more interactive than text created in Three.js or Drei library. 
export default function Experience()
{
    // Using ref is a lot easier. If you want to remove transform controls they don't require any other edits.
    const cube = useRef()
    const sphere = useRef()

    return <>

        {/* Make default makes sure that these controls are the default controls, (helpers have access to which control is the default)
            after this change these constrols should not be interacting when transform controls are in use */}
        <OrbitControls enableDamping={ true } makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <PivotControls 
            anchor={ [0, 0, 0] } 
            depthTest={ false } 
            lineWidth={ 6 } 
            axisColors={ ['#9381ff', '#ff4d6d', '#7ae582'] } 
            scale={ 120 } 
            fixed={ true }>
            <mesh position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color='orange' />
                {/* Normally adding HTML elements in 3D can take up to 45 mins. 
                But with Drei it can be as easy as adding one component. 
                CSS can be added normally by targetting the wrapper class or the element itself which is the child. */}
                <Html ref={ sphere }
                    position={ [1, 1, 0] } 
                    wrapperClass='label'
                    distanceFactor={ 10 }
                    center
                    occlude={ [sphere, cube] }>Hello World</Html>
            </mesh>
        </PivotControls>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color='mediumpurple' />
        </mesh>

        {/* Known as gizmo, by default there is some bugs with Transform controls. 
        And orbit controls will interact with transform controls when they are being used. */}
        {/* <TransformControls object={ cube } /> */}

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            {/* <meshStandardMaterial color='greenyellow' /> */}
            <MeshReflectorMaterial 
                resolution={ 450 }
                blur={ [1000, 1000] }
                mixBlur={ 0.5 } 
                mirror={ 0.25 } />
        </mesh>

        {/* Troika text */}
        <Float 
            speed={ 4.5 }
            floatIntensity={ 0.25 }
            rotationIntensity={ 0.8 }
            floatingRange={ [2, 6] } >
        <Text 
            font='./bangers-v20-latin-regular.woff'
            fontSize={ 1.5 }
            color='yellow'
            position-y={ 3 }
            position-z={ -3 }
            textAlign='center'>This is a test</Text>
        </Float>
    </>
}