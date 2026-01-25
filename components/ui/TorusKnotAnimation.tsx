'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface TorusKnotAnimationProps {
  className?: string
}

export default function TorusKnotAnimation({ className = '' }: TorusKnotAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const torusKnotRef = useRef<THREE.Mesh | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // Create geometry
    const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16)

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0x7DF9FF) },
        color2: { value: new THREE.Color(0x21F5FF) },
        color3: { value: new THREE.Color(0x7DF9FF) },
        color4: { value: new THREE.Color(0x7DF9FF) },
        lightPosition: { value: new THREE.Vector3(5, 5, 5) },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform vec3 lightPosition;
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          float t = sin(vPosition.x * 0.5 + vPosition.y * 0.5 + vPosition.z * 0.5 + time * 0.2) * 0.5 + 0.5;
          vec3 color = mix(
            mix(color1, color2, smoothstep(0.0, 0.33, t)),
            mix(color3, color4, smoothstep(0.67, 1.0, t)),
            smoothstep(0.33, 0.67, t)
          );
          vec3 lightDir = normalize(lightPosition - vViewPosition);
          vec3 viewDir = normalize(vViewPosition);
          vec3 halfDir = normalize(lightDir + viewDir);
          float specular = pow(max(dot(vNormal, halfDir), 0.0), 32.0);
          float rimAmount = 0.7;
          float rim = smoothstep(0.6, 1.0, 1.0 - max(dot(viewDir, vNormal), 0.0));
          gl_FragColor = vec4(color + specular * 0.5 + rim * rimAmount * vec3(1.0), 1.0);
        }
      `
    })
    materialRef.current = material

    // Create mesh
    const torusKnot = new THREE.Mesh(geometry, material)
    torusKnot.castShadow = true
    torusKnot.receiveShadow = true
    torusKnotRef.current = torusKnot
    scene.add(torusKnot)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    pointLight.castShadow = true
    scene.add(pointLight)

    const fillLight = new THREE.PointLight(0x7DF9FF, 0.5)
    fillLight.position.set(-5, -5, -5)
    scene.add(fillLight)

    // Animate
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.time.value += 0.01
      }
      if (torusKnotRef.current) {
        torusKnotRef.current.rotation.x += 0.001
        torusKnotRef.current.rotation.y += 0.002
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return

      const width = window.innerWidth

      if (width <= 768) {
        cameraRef.current.position.z = 3
      } else if (width <= 1024) {
        cameraRef.current.position.z = 3
      } else {
        cameraRef.current.position.z = 3.5
      }

      cameraRef.current.aspect = container.clientWidth / container.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement)
      }
      geometry.dispose()
      material.dispose()
      rendererRef.current?.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute pointer-events-none ${className}`}
    />
  )
}
