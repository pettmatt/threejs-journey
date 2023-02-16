import { shaderMaterial, Sparkles, Center, useGLTF, OrbitControls, useTexture } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

// Some times it's easier to setup values outside of the main react function
const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#440033'),
    },
    portalVertexShader,
    portalFragmentShader
)

extend({ PortalMaterial })

export default function Experience()
{
    const { nodes } = useGLTF('./model/portal.glb')
    const bakedTexture = useTexture('./model/baked.jpg')
    // This can be done in the material tag, but in my opinion 
    // this preserves the original context better than if it was in the element.
    bakedTexture.flipY = false

    const portalMaterial = useRef()
    const cube = useRef()
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime

        // Portal animation
        portalMaterial.current.uTime += delta

        // Cube animation
        cube.current.rotation.y += delta * 0.25
        cube.current.rotation.z += delta * 0.15
        cube.current.position.y = Math.sin(time) * 0.1
        cube.current.position.z = Math.cos(time) * 0.03 - 1
    })

    return <>

        <color args={ ['#030202'] } attach='background' />

        <OrbitControls makeDefault />

        <mesh ref={ cube } scale={ 0.25 } position-z={ -1.1 } rotation-x={ Math.PI * 0.9 } rotation-y={ Math.PI * 0.75 }>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh>

        <Center>
            <mesh geometry={ nodes.baked.geometry }>
                <meshBasicMaterial map={ bakedTexture } />
            </mesh>
            <mesh 
                geometry={ nodes.poleLightA.geometry }
                position={ nodes.poleLightA.position }
            >
                <meshBasicMaterial color='#ffffe5' />
            </mesh>

            <mesh geometry={ nodes.baked.geometry }>
                <meshBasicMaterial map={ bakedTexture } />
            </mesh>
            <mesh 
                geometry={ nodes.poleLightB.geometry }
                position={ nodes.poleLightB.position }
            >
                <meshBasicMaterial color='#ffffe5' />
            </mesh>

            <mesh 
                geometry={ nodes.portalLight.geometry } 
                position={ nodes.portalLight.position } 
                rotation={ nodes.portalLight.rotation }
                scale={ nodes.portalLight.scale }
            >
                {/* Shader materials can be added streight to the material */}
                {/* <shaderMaterial 
                    vertexShader={ portalVertexShader }
                    fragmentShader={ portalFragmentShader }
                    uniforms={ {
                        uTime: { value: 0 },
                        uColorStart: { value: new THREE.Color('#ffffff') },
                        uColorEnd: { value: new THREE.Color('#660066') }
                    } }
                /> */}
                {/* or by creating custom material which handles the values earlier outside of the template */}
                <portalMaterial ref={ portalMaterial } />
            </mesh>

            <Sparkles 
                size= { 4 }
                scale={ [4, 2, 4] } 
                position-y={ 1 }
                speed={ 0.25 }
                count={ 30 }
            />

        </Center>

    </>
}