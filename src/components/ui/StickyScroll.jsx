import React from 'react'
import { gsap } from 'gsap'
import Lenis from "lenis"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import './sticky-scroll.css'

const StickyScroll = () => {

    React.useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const spotlightImageFinalPos = [
            [-140, -140],
            [40, -130],
            [-160, 20],
            [20, 30],
        ];

        const finalRotations = [-3, 4, 2, -4];
        const spotlightEls = gsap.utils.toArray('.spotlight-img');
        const initialRotations = [5, -3, 3.5, -1];
        const phaseOnStartOffsets = [0, 0.1, 0.2, 0.3];
        const phaseTwoStartOffsets = [0.5, 0.55, 0.6, 0.65];

        const lenis = new Lenis();
        // update ScrollTrigger when Lenis scrolls
        lenis.on('scroll', () => ScrollTrigger.update());

        const st = ScrollTrigger.create({
            trigger: '.spotlight',
            start: 'top top',
            end: `+=${window.innerHeight * 3}`,
            pin: true,
            pinSpacing: true,
            pinType: 'fixed',
            anticipatePin: 1,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                spotlightEls.forEach((el, index) => {
                    const initialRotation = initialRotations[index] || 0;
                    const phase1Start = phaseOnStartOffsets[index] || 0;
                    const phase1End = Math.min(
                        phase1Start + (0.45 - phase1Start) * 0.9,
                        0.45
                    );
                    const phase2Start = phaseTwoStartOffsets[index] || 0.5;
                    const phase2End = Math.min(
                        phase2Start + (0.95 - phase2Start) * 0.9,
                        0.95
                    );

                    const finalX = spotlightImageFinalPos[index][0];
                    const finalY = spotlightImageFinalPos[index][1];

                    let x = -50;
                    let y = 200;
                    let rotation = initialRotation;

                    // Phase 1: enter / rise up
                    if (progress < phase1Start) {
                        y = 200;
                        rotation = initialRotation;
                    } else if (progress <= phase1End) {
                        let t = (progress - phase1Start) / (phase1End - phase1Start);
                        t = 1 - Math.pow(1 - t, 3);
                        y = 200 - t * 250;
                    } else if (progress < phase2Start) {
                        y = -50;
                    } else if (progress <= phase2End) {
                        let t = (progress - phase2Start) / (phase2End - phase2Start);
                        t = 1 - Math.pow(1 - t, 3);
                        x = -50 + (finalX + 50) * t;
                        y = -50 + (finalY + 50) * t;
                        rotation = initialRotation + t * (finalRotations[index] - initialRotation);
                    } else {
                        x = finalX;
                        y = finalY;
                        rotation = finalRotations[index];
                    }

                    el.style.zIndex = String(spotlightEls.length - index);

                    gsap.to(el, {
                        duration: 0.6,
                        ease: 'power3.out',
                        overwrite: true,
                        css: {
                            '--txp': `${x}%`,
                            '--typ': `${y}%`,
                            '--rot': `${rotation}deg`
                        }
                    });
                });
            }
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // ensure initial CSS percent variables and visible stacked state are applied
        spotlightEls.forEach((el, index) => {
            el.style.setProperty('--txp', '-50%');
            el.style.setProperty('--typ', '200%');
            el.style.setProperty('--rot', '0deg');
            el.style.opacity = '1';
            el.style.zIndex = String(spotlightEls.length - index);
        });

        return () => {
            st && st.kill();
            gsap.killTweensOf(spotlightEls);
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
            lenis && lenis.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);


  return (
    <div className="sticky-scroll-root">
    <section className="intro">
        <h1>we make visual breathe pas intro</h1>
    </section>
    <section className="spotlight">
        <div className="spotlight-header">
            <h1>time stretch gitu lah ya</h1>
        </div>
        <div className="spotlight-images">
            <div className="spotlight-img">
                <img src="/photos/carousel/1.png" alt="foto 1" />
            </div>
            <div className="spotlight-img">
                <img src="/photos/carousel/2.png" alt="foto 1" />
            </div>
            <div className="spotlight-img">
                <img src="/photos/carousel/3.png" alt="foto 1" />
            </div>
            <div className="spotlight-img">
                <img src="/photos/carousel/4.png" alt="foto 1" />
            </div>
        </div>
    </section>
    <section className="outro">
        <h1>we make visual breathe</h1>
    </section>
    </div>
  )
}

export default StickyScroll