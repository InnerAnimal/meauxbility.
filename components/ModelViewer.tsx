'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function ModelViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const modelViewer = entry.target.querySelector('model-viewer')
          if (modelViewer) {
            if (entry.isIntersecting) {
              modelViewer.setAttribute('auto-rotate', '')
            } else {
              modelViewer.removeAttribute('auto-rotate')
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <>
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        strategy="lazyOnload"
      />
      <div ref={containerRef} className="mbx-3d-accent" aria-hidden="true">
        <model-viewer
          src="https://cdn.shopify.com/3d/models/4b0a47ca8a38b77c/Kinetic_Symmetry_0831084700_generate.glb"
          alt="Decorative 3D element"
          rotation-per-second="18deg"
          camera-controls="false"
          disable-zoom="true"
          disable-pan="true"
          disable-tap="true"
          interaction-prompt="none"
          shadow-intensity="0"
          exposure="1.2"
          loading="lazy"
          reveal="auto"
        />
      </div>
    </>
  )
}
