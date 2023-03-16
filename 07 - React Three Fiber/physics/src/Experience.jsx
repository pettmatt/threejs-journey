import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics, RigidBody, Debug, TrimeshCollider, CuboidCollider } from '@react-three/rapier'
import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef()
    const cubeJump = () => {
        cube.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5
        })
    }

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <Physics>

            <Debug />

            <RigidBody colliders="ball">
                <mesh castShadow position={ [ - 2, 2, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody colliders={ false }>
                <CuboidCollider args={ [ 1, 1, 1 ] } position={ [ 0, 1, 0 ] } rotation-y={ Math.PI * 0.25 } />
                <mesh castShadow>
                    <torusGeometry args={ [ 1, 0.5, 16, 32 ] } />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>

            <RigidBody ref={ cube } position-z={ 1.25 } onClick={ cubeJump }>
                <mesh castShadow>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>

            <RigidBody>
                <mesh castShadow position={ [ 2, 2, 0 ] }>
                    <boxGeometry args={ [ 1.5, 1.5, 2 ] } />
                    <meshStandardMaterial color="lightblue" />
                </mesh>
            </RigidBody>

            <RigidBody type='fixed'>
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>
        </Physics>

    </>
}