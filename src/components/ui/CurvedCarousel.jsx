import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './curved-carousel.css'

const NUM = 10

const CurvedCarousel = ({ count = NUM, images }) => {
  const ringRef = useRef(null)
  const xPosRef = useRef(0)
  const draggingRef = useRef(false)
  const imgRefs = useRef([])
  const imgs = images || Array.from({ length: count }).map((_, i ) => `/photos/carousel/${i + 1}.png`);

  useEffect(() => {
    const ring = ringRef.current
    const imgsEls = imgRefs.current

    // initial setup
    gsap.set(ring, { rotationY: 180, cursor: 'grab' })

    imgsEls.forEach((el, i) => {
      gsap.set(el, {
        rotateY: i * -360 / count,
        transformOrigin: '50% 50% 500px',
        z: -500,
        backgroundImage: `url(${imgs[i]})`,
        backgroundPosition: getBgPos(i, 180, count),
        backfaceVisibility: 'hidden'
      });
    });
    const tl = gsap.timeline()
      .from(imgsEls, {
        duration: 1.2,
        y: 0,         
        opacity: 1,   
        stagger: 0.1,
        ease: 'power2.inOut', 
      })

    // hover behaviour
    imgsEls.forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        const current = e.currentTarget
        gsap.to(imgsEls, { opacity: (i, t) => (t === current ? 1 : 0.5), ease: 'power3' })
      })
      el.addEventListener('mouseleave', () => {
        gsap.to(imgsEls, { opacity: 1, ease: 'power2.inOut' })
      })
    })

    function onPointerDown(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      xPosRef.current = Math.round(clientX)
      draggingRef.current = true
      gsap.set(ring, { cursor: 'grabbing' })
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('touchmove', onPointerMove, { passive: false })
    }

    function onPointerMove(e) {
      if (!draggingRef.current) return
      if (e.touches) e.preventDefault()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const delta = Math.round(clientX) - xPosRef.current
      gsap.to(ring, {
        rotationY: `-=${delta % 360}`,
        onUpdate: () => {
          const rot = gsap.getProperty(ring, 'rotationY')
          imgsEls.forEach((el, i) => gsap.set(el, { backgroundPosition: getBgPos(i, rot) }))
        }
      })
      xPosRef.current = Math.round(clientX)
    }

    function onPointerUp() {
      draggingRef.current = false
      gsap.set(ring, { cursor: 'grab' })
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('touchstart', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)

    // cleanup
    return () => {
      tl.kill()
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('touchend', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
    }
  }, [imgs])

  return (
    <div className="carousel" aria-hidden="false">
      <div className="ring" ref={ringRef}>
        {imgs.map((src, i) => (
          <div
            key={i}
            className="img"
            ref={(el) => (imgRefs.current[i] = el)}
            style={{ zIndex: imgs.length - i }}
            role="img"
            aria-label={`Image ${i + 1}`}
          >
          </div>
        ))}
      </div>
    </div>
  )
}

function getBgPos(i, rotationY, count = 10) {
  const rot = rotationY - 180 - i * (360 / count);
  const wrapped = ((rot % 360) + 360) % 360;
  return `${100 - (wrapped / 360) * 500}px 0px`;
}

export default CurvedCarousel