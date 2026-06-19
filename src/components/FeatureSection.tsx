import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SiSamsung, SiApple, SiGoogle, SiHuawei, SiXiaomi, SiHp, SiDell, SiAsus, 
  SiLenovo, SiSony, SiMotorola, SiLg, SiAcer, SiBose
} from 'react-icons/si';
import { useLanguage } from '@/src/contexts/LanguageContext';

const iconConfigs: any[] = [
  { Icon: SiSamsung, color: "#1428A0" },
  { Icon: SiApple, color: "#000000" },
  { Icon: SiGoogle, color: "#4285F4" },
  { Icon: SiHuawei, color: "#FF0000" },
  { Icon: SiXiaomi, color: "#FF6700" },
  { Icon: SiHp, color: "#0096D6" },
  { Icon: SiDell, color: "#007DB8" },
  { Icon: SiAsus, color: "#00539B" },
  { Icon: SiLenovo, color: "#E2231A" },
  { Icon: SiSony, color: "#000000" },
  { Icon: SiMotorola, color: "#5C9291" },
  { Icon: SiLg, color: "#A50034" },
  { Icon: SiAcer, color: "#83B81A" },
  { Icon: SiBose, color: "#010101" },
  { Icon: null, img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Tecno_Mobile_logo.svg" },
  { Icon: null, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/Infinix_Logo.svg" },
  { Icon: null, img: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Redmi_logo.svg" },
];

export default function FeatureSection() {
  const { t } = useLanguage();
  const orbitCount = 3;
  const orbitGap = 8; // space between orbits
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section className="relative w-full max-w-7xl mx-auto my-16 md:my-32 flex flex-col md:flex-row items-center justify-between min-h-[30rem] md:min-h-[35rem] border border-gray-100 bg-white overflow-hidden rounded-[40px] md:rounded-[60px] shadow-sm">
      {/* Left side: Title and text */}
      <div className="w-full md:w-1/2 z-10 p-8 md:p-12 md:pl-20">
        <h2 className="text-3xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
          {t('feature.title-1')} <br />
          <span className="text-[#007bff]">{t('feature.title-2')}</span>
        </h2>
        <p className="text-gray-500 mb-10 max-w-lg text-base md:text-lg">
          {t('feature.desc')}
        </p>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            {t('feature.explore')}
          </Link>
          <button className="px-8 py-4 border-2 border-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-all">
            {t('feature.learn')}
          </button>
        </div>
      </div>

      {/* Right side: Orbital animation */}
      <div className="relative w-full md:w-1/2 h-[30rem] md:h-full flex items-center justify-start overflow-hidden">
        <div className="relative w-[50rem] h-[50rem] translate-x-[25%] md:translate-x-[40%] flex items-center justify-center">
          {/* Central circle */}
          <div className="w-32 h-32 rounded-full bg-blue-50 shadow-inner flex items-center justify-center z-20">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              {(SiApple as any)({ size: 40, color: "#111827" })}
            </div>
          </div>

          {/* Generate Orbits */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${15 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;
            const duration = 20 + orbitIdx * 10;

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-dashed border-gray-200"
                style={{
                  width: size,
                  height: size,
                  animation: `spin ${duration}s linear infinite`,
                }}
              >
                {iconConfigs
                  .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    const BrandIcon = cfg.Icon as any;

                    return (
                      <div
                        key={iconIdx}
                        className="absolute bg-white rounded-full p-3 shadow-md border border-gray-50 hover:scale-110 transition-transform cursor-pointer"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                          // Counter-rotate the icons so they stay upright
                          animation: `spin ${duration}s linear infinite reverse`,
                        }}
                      >
                        {cfg.Icon ? (
                          <BrandIcon size={32} color={cfg.color} />
                        ) : (
                          <img
                            src={cfg.img}
                            alt="brand"
                            className="w-8 h-8 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
