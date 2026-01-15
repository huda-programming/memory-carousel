import { useState } from 'react';
import CurvedCarousel from './ui/CurvedCarousel';
import CountdownLoader from './ui/CountdownLoader';

const HeroSection = () => {
  const [loading, setLoading] = useState(true); // loader aktif di awal

  return (
    <>
      {/* Countdown Loader overlay */}
      {loading && <CountdownLoader onComplete={() => setLoading(false)} />}

      {/* Hero content muncul setelah loading selesai */}
      {!loading && (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#0b0a0a] text-[#d8dbd2]">
          <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pt-32 text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Meskipun tidak semua terekam,
              <span className="block text-white/60">Tapi aku selalu melihatmu utuh</span>
            </h1>
          </div>

          <div className="relative">
            <CurvedCarousel />
          </div>

          {/* fade edges */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-1/3 w-32 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-1/3 w-32 bg-gradient-to-l from-black to-transparent" />
        </section>
      )}
    </>
  );
};

export default HeroSection;
