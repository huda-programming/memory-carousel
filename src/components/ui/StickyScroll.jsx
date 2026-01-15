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
        <div className="flex flex-col gap-6 text-center container mx-auto px-6">
            <h1>Selamat <span className="highlight line-through">Bertambah</span> Bertumbuh</h1>
            <p className='text-xl'>
                Selamat bertambah usia, di usia yang baru ini, semoga menjadi lebih baik, lebih menyenangkan, lebih bermanfaat, dan lebih membahagiakan. <br /> Tetap semangat dalam menjalani hari-hari ya, cantik. Selalu diberikan kesehatan dan kebahagiaan jugaa. Happy birthday!
            </p>
        </div>
    </section>
    <section className="spotlight">
        <div className="spotlight-header">
            <h1>Terima Kasih untuk Segala Kenang</h1>
        </div>
        <div className="spotlight-images">
            <div className="spotlight-img">
                <img src="/photos/11.png" alt="foto 1" />
            </div>
            <div className="spotlight-img">
                <img src="/photos/12.png" alt="foto 1" />
            </div>
            <div className="spotlight-img">
                <img src="/photos/13.png" alt="foto 1" />
            </div>
            <div className="spotlight-img">
                <img src="/photos/14.png" alt="foto 1" />
            </div>
        </div>
    </section>
    <section className="outro min-h-screen w-full bg-[#0b0a0a] text-[#d8dbd2]">
  <div className="min-h-screen flex items-center justify-center">
    <div className="grid w-full max-w-6xl grid-cols-6 gap-12 px-6">
      {/* Puisi kiri */}
      <div className="col-span-3 flex items-center">
        <div className="mx-auto w-full max-w-md flex flex-col gap-4 text-left">
          <h2 className="mb-4 text-4xl font-semibold bg-gradient-to-r from-slate-400 to-white bg-clip-text text-transparent">
            Tambah / Tumbuh
          </h2>

          <div className="space-y-1 text-slate-300 leading-relaxed">
            <p>Rangkul lembut jemarimu</p>
            <p>Selalu terasa layaknya kemarin</p>
            <p>Ingar bingar dentuman hidup</p>
            <p>Menjadi bisu kala bersamamu</p>
          </div>

          <div className="my-6 space-y-1 text-slate-300 leading-relaxed">
            <p>Selamat bertambah</p>
            <p>Niscaya tiada pernah berkurang</p>
            <p>Kau telah merekah bagai kenang yang menyesakkan kening</p>
            <p>Lalui sedih, senang, marah, kecewa, hidup...</p>
            <p>Tiada berkurang</p>
            <p>Tetaplah tumbuh</p>
          </div>

          <p className="mt-8 text-sm text-slate-400">Januari, 16, 2026</p>
        </div>
      </div>

      {/* Blok kanan */}
      <div className="col-span-3 flex items-center">
        <div className="mx-auto w-full max-w-md text-center flex flex-col gap-2">
          <h2 className="mb-2 text-3xl font-semibold bg-gradient-to-r from-slate-400 to-white bg-clip-text text-transparent text-left" >
            Selamat, Cantik!
          </h2>
            <div className="mt-4 text-left font-sans text-base text-slate-300 leading-relaxed flex flex-col gap-4">
                <p>
                    Semoga anggun suka yaa, sebenarnya dari kemarin aku ketak ketik nulis ini,
                    maafin aku yaa gabisa bilang soalnya (rahasia) hehee. Seru tau nemenin anggun tumbuh dari kecil sampai sekarang, aku harap anggun juga ngerasa seru sama aku. 
                    Terima kasih udah jadi pacar yang seru, semoga di umur yang baru ini anggun makin bahagia, sehat, sukses, dan makin cantik pastinyaa hehe.
                </p>
                <p>
                    maafin aku kalo sering bikin anggun kesel yaaa. aku selalu berusaha tau buat jadi pacar yang baik buat anggun, aku sadar kalo aku masih banyak kurangnya. makasih udah mau sama aku ya cantikkk.
                </p>
                <p>
                    Waktu anggun bilang mau bikin board yang isinya fotonya anggun dan kawan kawan, sama aku juga. aku seneng banget, aku jadi kepikiran bikinin web yang bisa anggun pasang foto sesukanyaa, bilang aja kalo mau diganti fotonya ya cantik, kalo bosen bisa request fotonya ke aku hehe.
                </p>
                <p>
                    Selamat ulang tahun anggun, semoga semua doa dan harapan anggun terkabul di tahun ini dan tahun-tahun berikutnya. <br /> <br /> Aku sayang banget sama anggoooooonnnnnn 😘❤️🎉🎂
                </p>
            </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default StickyScroll