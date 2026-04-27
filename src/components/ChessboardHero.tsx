import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ChessboardHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const container = containerRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lightweightMode = prefersReducedMotion || window.innerWidth < 1100
    const pointer = { x: 0, y: 0 }
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#100d0b')
    scene.fog = new THREE.Fog(0x100d0b, 18, 40)

    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(10.2, 6.5, 12.6)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !lightweightMode,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lightweightMode ? 1.2 : 1.7))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.shadowMap.enabled = !lightweightMode
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight('#fff6e9', 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.SpotLight('#c8ff2e', 120, 70, 0.45, 0.55, 1)
    keyLight.position.set(6, 11, 4)
    keyLight.castShadow = !lightweightMode
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    scene.add(keyLight)

    const fillLight = new THREE.PointLight('#ffffff', 28, 34)
    fillLight.position.set(8, 3, 8)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight('#89a0ff', 34, 38)
    rimLight.position.set(-7, 5, -7)
    scene.add(rimLight)

    const boardGroup = new THREE.Group()
    boardGroup.rotation.x = -0.42
    boardGroup.rotation.z = 0.08
    boardGroup.position.set(5.1, -1.3, 0.5)
    scene.add(boardGroup)

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 0.44, 11.2),
      new THREE.MeshStandardMaterial({
        color: '#120f0d',
        roughness: 0.72,
        metalness: 0.22,
      }),
    )
    frame.receiveShadow = true
    boardGroup.add(frame)

    const squareSize = 1.1
    const boardOffset = -3.5 * squareSize
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: '#44503a',
      roughness: 0.44,
      metalness: 0.14,
    })
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: '#d7c39f',
      roughness: 0.38,
      metalness: 0.08,
    })

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const square = new THREE.Mesh(
          new THREE.BoxGeometry(squareSize, 0.16, squareSize),
          (row + col) % 2 === 0 ? lightMaterial : darkMaterial,
        )
        square.position.set(boardOffset + col * squareSize, 0.15, boardOffset + row * squareSize)
        square.receiveShadow = true
        boardGroup.add(square)
      }
    }

    const createKing = (color: string, scale = 1) => {
      const group = new THREE.Group()
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.26,
        metalness: 0.8,
      })

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 0.18, 28), material)
      base.position.y = 0.09
      group.add(base)

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.36, 1.18, 24), material)
      body.position.y = 0.72
      group.add(body)

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), material)
      head.position.y = 1.48
      group.add(head)

      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.08), material)
      crossH.position.y = 1.72
      group.add(crossH)

      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), material)
      crossV.position.y = 1.72
      group.add(crossV)

      group.scale.setScalar(scale)
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = !lightweightMode
          child.receiveShadow = true
        }
      })

      return group
    }

    const createKnight = (color: string, scale = 1) => {
      const group = new THREE.Group()
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.68,
      })

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.16, 24), material)
      base.position.y = 0.08
      group.add(base)

      const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.72, 4, 8), material)
      neck.position.set(-0.02, 0.72, 0)
      neck.rotation.z = -0.18
      group.add(neck)

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.22), material)
      head.position.set(0.18, 1.24, 0)
      head.rotation.z = 0.25
      group.add(head)

      group.scale.setScalar(scale)
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = !lightweightMode
          child.receiveShadow = true
        }
      })

      return group
    }

    const king = createKing('#c8ff2e', 1.04)
    king.position.set(1.35, 0.24, 0)
    boardGroup.add(king)

    const knight = createKnight('#f4f1ee', 0.94)
    knight.position.set(-2.2, 0.24, 1.65)
    knight.rotation.y = 0.42
    boardGroup.add(knight)

    const floorGlow = new THREE.Mesh(
      new THREE.CircleGeometry(8.5, 40),
      new THREE.MeshBasicMaterial({
        color: '#c8ff2e',
        transparent: true,
        opacity: 0.05,
      }),
    )
    floorGlow.rotation.x = -Math.PI / 2
    floorGlow.position.set(4.6, -2.65, 2.6)
    scene.add(floorGlow)

    const cameraTarget = new THREE.Vector3(2.8, 0.55, 0.5)
    const clock = new THREE.Clock()
    let animationId = 0
    let isVisible = true
    let pageVisible = !document.hidden

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio > 0.12
      },
      { threshold: [0, 0.12, 0.4] },
    )
    observer.observe(container)

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }

    const handlePointerLeave = () => {
      pointer.x = 0
      pointer.y = 0
    }

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden
    }

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (!isVisible || !pageVisible) {
        return
      }

      const time = clock.getElapsedTime()
      const pointerScale = lightweightMode ? 0.18 : 0.55

      camera.position.x = 10.2 + Math.sin(time * 0.16) * 0.45 + pointer.x * pointerScale
      camera.position.y = 6.5 + Math.cos(time * 0.14) * 0.2 - pointer.y * (pointerScale * 0.4)
      camera.position.z = 12.6 + Math.cos(time * 0.12) * 0.35
      camera.lookAt(cameraTarget.x + pointer.x * 0.2, cameraTarget.y - pointer.y * 0.08, cameraTarget.z)

      if (!lightweightMode) {
        boardGroup.rotation.z = 0.08 + Math.sin(time * 0.18) * 0.015
        boardGroup.position.y = -1.3 + Math.sin(time * 0.24) * 0.05
        king.position.y = 0.24 + Math.sin(time * 0.7) * 0.08
        knight.position.y = 0.24 + Math.sin(time * 0.6 + 1.2) * 0.05
      }

      renderScene()
    }

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lightweightMode ? 1.2 : 1.7))
      renderScene()
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)

    renderScene()
    if (lightweightMode) {
      animationId = requestAnimationFrame(() => {
        renderScene()
      })
    } else {
      animate()
    }

    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }} />
}
