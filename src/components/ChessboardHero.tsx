import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ChessboardHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#27221e')
    scene.fog = new THREE.Fog(0x27221e, 10, 40)

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(10, 8, 20)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight('#c8ff2e', 150)
    spotLight.position.set(5, 10, 5)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.angle = 0.4
    spotLight.penumbra = 0.5
    scene.add(spotLight)

    const pointLight = new THREE.PointLight('#ffffff', 50)
    pointLight.position.set(-5, 5, -5)
    scene.add(pointLight)

    // Board Group
    const boardGroup = new THREE.Group()
    scene.add(boardGroup)

    // Create 8x8 grid
    const squareSize = 1.2
    const boardOffset = -3.5 * squareSize
    
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: '#3d2b1f',
      roughness: 0.3,
      metalness: 0.2,
    })
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: '#d4a373',
      roughness: 0.3,
      metalness: 0.2,
    })

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const geometry = new THREE.BoxGeometry(squareSize, 0.2, squareSize)
        const isDark = (row + col) % 2 === 1
        const material = isDark ? darkMaterial : lightMaterial
        const square = new THREE.Mesh(geometry, material)
        square.position.set(
          boardOffset + col * squareSize,
          -0.1,
          boardOffset + row * squareSize
        )
        square.receiveShadow = true
        boardGroup.add(square)
      }
    }

    // Create a procedural King piece
    const createKing = (color: string, position: THREE.Vector3) => {
      const group = new THREE.Group()
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.8,
      })

      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.1, 32), material)
      base.position.y = 0.05
      group.add(base)

      // Body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 1.2, 32), material)
      body.position.y = 0.65
      group.add(body)

      // Head/Top
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), material)
      head.position.y = 1.3
      group.add(head)

      // Cross (simple)
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), material)
      crossH.position.y = 1.55
      group.add(crossH)
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), material)
      crossV.position.y = 1.55
      group.add(crossV)

      group.position.copy(position)
      group.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      return group
    }

    const king = createKing('#c8ff2e', new THREE.Vector3(0, 0, 0))
    boardGroup.add(king)

    // Animation
    let animationId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Cinematic camera movement
      camera.position.x = 12 * Math.cos(time * 0.15)
      camera.position.z = 12 * Math.sin(time * 0.15)
      camera.position.y = 8 + Math.sin(time * 0.3) * 2
      camera.lookAt(0, 0.5, 0)

      // Piece subtle float
      king.position.y = Math.sin(time * 0.5) * 0.2

      // Board subtle tilt
      boardGroup.rotation.z = Math.sin(time * 0.2) * 0.05
      boardGroup.rotation.x = Math.cos(time * 0.2) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 opacity-50 md:opacity-100"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
