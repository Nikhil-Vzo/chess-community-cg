import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // --- SCENE SETUP ---
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x100d0b, 0.025)

    const camera = new THREE.PerspectiveCamera(40, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
    // Move camera further back to prevent cropping
    camera.position.z = 22
    camera.position.y = 2

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    })
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // --- MATERIALS ---
    // Solid dark metallic core
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1500,
      metalness: 0.9,
      roughness: 0.2,
    })

    // Glowing golden wireframe
    const wireMaterial = new THREE.LineBasicMaterial({ 
      color: 0xd4af37,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })

    // Subtle neon highlight wireframe
    const highlightMaterial = new THREE.LineBasicMaterial({
      color: 0xc8ff2e,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })

    const group = new THREE.Group()
    const geometriesToDispose: any[] = []

    // Helper to build a majestic multi-layered part
    const addPart = (geometry: THREE.BufferGeometry, yOffset: number) => {
      // 1. Solid Core
      const solid = new THREE.Mesh(geometry, solidMaterial)
      solid.position.y = yOffset
      group.add(solid)

      // 2. Main Gold Wireframe (slightly scaled up)
      const wireframe = new THREE.WireframeGeometry(geometry)
      const lines = new THREE.LineSegments(wireframe, wireMaterial)
      lines.position.y = yOffset
      lines.scale.set(1.01, 1.01, 1.01)
      group.add(lines)

      // 3. Neon Highlight Wireframe (scaled even more, for a glowing aura effect)
      const auraLines = new THREE.LineSegments(wireframe, highlightMaterial)
      auraLines.position.y = yOffset
      auraLines.scale.set(1.04, 1.04, 1.04)
      group.add(auraLines)

      geometriesToDispose.push(geometry, wireframe)
      return solid
    }

    // --- BUILD THE KING PIECE ---
    // Base tier 1
    addPart(new THREE.CylinderGeometry(2.8, 3.2, 0.6, 64), -4.5)
    
    // Base tier 2
    addPart(new THREE.CylinderGeometry(2.4, 2.8, 0.5, 64), -3.95)

    // Base Curve (Torus)
    const baseCurve = new THREE.TorusGeometry(2.1, 0.4, 16, 64)
    const curveMesh = new THREE.Mesh(baseCurve, solidMaterial)
    curveMesh.position.y = -3.5
    curveMesh.rotation.x = Math.PI / 2
    group.add(curveMesh)
    const curveWire = new THREE.LineSegments(new THREE.WireframeGeometry(baseCurve), wireMaterial)
    curveWire.position.y = -3.5
    curveWire.rotation.x = Math.PI / 2
    curveWire.scale.set(1.02, 1.02, 1.02)
    group.add(curveWire)
    geometriesToDispose.push(baseCurve)

    // Body (Stem)
    addPart(new THREE.CylinderGeometry(0.9, 2.1, 5.5, 64), -0.8)

    // Collar Rings
    const collar1 = new THREE.TorusGeometry(1.3, 0.25, 16, 64)
    const c1Solid = new THREE.Mesh(collar1, solidMaterial)
    c1Solid.position.y = 1.8
    c1Solid.rotation.x = Math.PI / 2
    group.add(c1Solid)
    const c1Wire = new THREE.LineSegments(new THREE.WireframeGeometry(collar1), wireMaterial)
    c1Wire.position.y = 1.8
    c1Wire.rotation.x = Math.PI / 2
    c1Wire.scale.set(1.03, 1.03, 1.03)
    group.add(c1Wire)
    geometriesToDispose.push(collar1)

    addPart(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 64), 2.1)

    // Head (Squashed Sphere)
    const headGeom = new THREE.SphereGeometry(1.5, 32, 32)
    const head = addPart(headGeom, 3.2)
    head.scale.y = 0.85
    // also scale the wireframes we just added for the head
    group.children[group.children.length - 2].scale.set(1.01, 0.86, 1.01)
    group.children[group.children.length - 1].scale.set(1.04, 0.89, 1.04)

    // Crown Base
    addPart(new THREE.CylinderGeometry(1.6, 1.2, 0.8, 32), 4.2)

    // Cross Vertical
    addPart(new THREE.BoxGeometry(0.5, 1.6, 0.4), 5.4)

    // Cross Horizontal
    addPart(new THREE.BoxGeometry(1.4, 0.4, 0.4), 5.5)

    // Center the whole piece so it rotates elegantly around its visual center
    group.position.y = 0.5
    scene.add(group)

    // --- PARTICLES (MAGIC DUST AURA) ---
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 300
    const posArray = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount * 3; i+=3) {
      // Cylindrical random distribution around the piece
      const radius = 3 + Math.random() * 5
      const theta = Math.random() * 2 * Math.PI
      const y = -6 + Math.random() * 14
      
      posArray[i] = radius * Math.cos(theta)
      posArray[i+1] = y
      posArray[i+2] = radius * Math.sin(theta)
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xc8ff2e,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)
    geometriesToDispose.push(particlesGeometry)

    // --- DYNAMIC LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight)

    // Orbiting Golden Light
    const goldLight = new THREE.PointLight(0xd4af37, 50, 20)
    scene.add(goldLight)

    // Orbiting Neon Light
    const neonLight = new THREE.PointLight(0xc8ff2e, 30, 20)
    scene.add(neonLight)

    // --- ANIMATION LOOP ---
    let animationFrameId: number
    let time = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      time += 0.005
      
      // Majestic slow rotation of the King
      group.rotation.y = time * 0.5
      group.rotation.x = Math.sin(time * 0.5) * 0.05
      group.rotation.z = Math.cos(time * 0.3) * 0.03
      
      // Float up and down
      group.position.y = 0.5 + Math.sin(time * 1.5) * 0.4

      // Rotate particle aura
      particlesMesh.rotation.y = -time * 0.2
      particlesMesh.position.y = Math.sin(time * 0.8) * 0.5

      // Orbiting lights for dynamic metallic reflections
      goldLight.position.x = Math.sin(time * 2) * 8
      goldLight.position.z = Math.cos(time * 2) * 8
      goldLight.position.y = 2 + Math.sin(time * 1.5) * 4

      neonLight.position.x = Math.cos(time * 1.8) * 7
      neonLight.position.z = Math.sin(time * 1.8) * 7
      neonLight.position.y = -2 + Math.cos(time * 1.2) * 5

      renderer.render(scene, camera)
    }

    animate()

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      geometriesToDispose.forEach(geom => geom.dispose())
      solidMaterial.dispose()
      wireMaterial.dispose()
      highlightMaterial.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
