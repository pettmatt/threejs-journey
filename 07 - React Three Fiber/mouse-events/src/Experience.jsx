import { useFrame } from '@react-three/fiber'
import { meshBounds, OrbitControls, useGLTF } from '@react-three/drei'
import { useRef } from 'react'


export default function Experience()
{
    const cube = useRef()
    const burger = useGLTF("./hamburger.glb")
    
    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
    })

    const eventHandler = () => {
        cube.current.material.color.set(`hsl(${ Math.random() * 360 }, 100%, 75%)`)
    }

    return <>

        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <primitive object={ burger.scene } scale={ 0.15 } position-y={ -0.3 } 
            onClick={ (event) => {
                // Works as expected in an object. Doesn't trigger for every object inside of the parent object.
                event.stopPropagation()
                console.log(event.object.name)
            } } />

        {/* Stop propagation stops the click event from registering the click after the click has been registered by this object */}
        <mesh position-x={ - 2 } onClick={ (event) => event.stopPropagation() }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 }
            // When precise clicks are not necessary, meshBounds can be used to offer a clickable bounds over the object
            raycast={ meshBounds }
            onClick={ eventHandler }
            onPointerEnter={ () => document.body.style.cursor = "pointer" }
            onPointerLeave={ () => document.body.style.cursor = "default" }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}