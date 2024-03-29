import { useMatcapTexture, Text3D, OrbitControls, Center } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Classic way
const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
const material = new THREE.MeshMatcapMaterial()

export default function Experience()
{
    const donuts = useRef([])
    // const donutsGroup = useRef()
    // const [ torusGeometry, setTorusGeometry ] = useState()
    // const [ material, setMaterial ] = useState()
    const [ matcapTexture ] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)

    useEffect(() => {
        // Change encoding so the colors show correctly
        matcapTexture.encoding = THREE.sRGBEncoding
        matcapTexture.encoding = true

        // Threejs classic way requires details what to update and then that there IS an update
        material.matcap = matcapTexture
        material.needsUpdate = true
    }, [])

    useFrame((state, delta) => {
        // for(const donut of donutsGroup.current.children) {
        for(const donut of donuts.current) {
            donut.rotation.y += delta * 0.35
        }
    })

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* For whatever reason ref will work on useState */}
        {/* Don't really know who would want to add geometries and materials this way... */}
        {/* <torusGeometry ref={ setTorusGeometry } args={ [3, 1.3, 16, 32] } />
        <meshMatcapMaterial ref={ setMaterial } matcap={ matcapTexture }  /> */}

        {/* <mesh scale={ 1.5 }>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh> */}

        <Center>
            <Text3D 
                material={ material }
                font='./fonts/helvetiker_regular.typeface.json'
                size={ 0.75 }
                height={ 0.2 }
                curveSegments={ 12 }
                bevelEnabled
                bevelThickness={ 0.02 }
                bevelSize={ 0.02 }
                bevelOffset={ 0 }
                bevelSegments={ 5 }
            >
                Hello World
            </Text3D>

        </Center>

        {/* This is one way to affect every child (for example adding animation) */}
        {/* <group ref={ donutsGroup }> */}
            { [...Array(100)].map((value, index) =>
                <mesh 
                    // Not that easy to understand and ref isn't really meant for this kind of behavior
                    ref={ (element) => donuts.current[index] = element }
                    key={ index } 
                    geometry={ torusGeometry }
                    material={ material }
                    position={[
                        (Math.random() - 0.5) * 30,
                        (Math.random() - 0.5) * 30,
                        (Math.random() - 0.5) * 30,
                    ]}
                    scale={ 0.2 + Math.random() * 0.2}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        0
                    ]}
                >
                </mesh>
            )}
        {/* </group> */}

        <mesh position={ [0, 2, -15] }>
            <torusGeometry args={ [3, 1.3, 16, 32] } />
            <meshMatcapMaterial matcap={ matcapTexture }  />
        </mesh>
    </>
}