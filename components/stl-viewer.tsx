"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { STLLoader } from "three/addons/loaders/STLLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

interface STLViewerProps {
  file: File
  color: string
}

export function STLViewer({ file, color }: STLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 0, 100)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 1)
    backLight.position.set(-1, -1, -1)
    scene.add(backLight)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Load STL
    const loader = new STLLoader()
    const reader = new FileReader()

    reader.onload = (e) => {
      const geometry = loader.parse(e.target?.result as ArrayBuffer)
      geometry.computeVertexNormals()
      geometry.center()

      const material = new THREE.MeshStandardMaterial({ color: color })
      const mesh = new THREE.Mesh(geometry, material)

      // Auto-scale to fit
      geometry.computeBoundingBox()
      const boundingBox = geometry.boundingBox!
      const size = new THREE.Vector3()
      boundingBox.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 50 / maxDim
      mesh.scale.set(scale, scale, scale)

      scene.add(mesh)
      camera.position.set(0, 0, 100)
      controls.update()
    }

    reader.readAsArrayBuffer(file)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [file, color])

  return <div ref={containerRef} className="w-full h-full" />
}
