import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import Model from './Model'
import Placeholder from './placeholder'
import Fox from './model/fox'

export default function Experience()
{
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* Shadow-normalBias fixes the shadow acne */}
        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } shadow-normalBias={ 0.04 } />
        <ambientLight intensity={ 0.5 } />

        {/* Model with lazy loading */}
        <Suspense fallback={ <Placeholder scale={ [2, 2, 3] } position-y={ 0.5 } /> }>
            <Model />
        </Suspense>

        <Fox />

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}