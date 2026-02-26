import { StudioHeader } from '@/app/components/studio/StudioHeader';
import { useNavigate } from 'react-router';
import { Home, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { SEO } from '@/app/components/SEO';

export default function Resources() {
  const navigate = useNavigate();

  const experts = [
    {
      name: 'Kirsty Milloy',
      specialty: 'Brand Identity Design & Illustration',
      description: 'Helping multi-passionate female founders clarify their brand so they shine and no one can look away!',
      portfolio: 'https://www.kirstymilloy.com/',
      linkedin: 'https://www.linkedin.com/in/kirstymilloy/',
      image: 'https://pink-quick-lizard-297.mypinata.cloud/ipfs/bafybeiaiobme5rp4aqbxlwuimd3xzd7ve3ahvizq6gjqyghxk2remk574u/Kirsty.jpeg',
    },
  ];

  const tools = [
    {
      name: 'Branding Style Guides',
      description: 'A curated collection of real brand guidelines from leading companies to inspire and inform your own brand standards.',
      link: 'https://brandingstyleguides.com/',
    },
    {
      name: 'Guidelines Online',
      description: 'A free, AI-powered tool that automatically generates one-page brand guidelines by analyzing uploaded logo files.',
      link: 'https://www.guidelines.online/',
    },
    {
      name: 'gingersauce',
      description: 'A brand book generator designed by creatives to help teams build professional brand guidelines quickly.',
      link: 'https://gingersauce.co/',
    },
    {
      name: 'Standards.',
      description: 'A premium platform for creating dynamic, website-like brand guidelines without coding. Founded by designers from Standards Manual.',
      link: 'https://standards.site/',
    },
  ];

  const supportingTools = [
    {
      name: 'Creator Pricing Calculator',
      description: 'Calculate your minimum and recommended rates based on your floor and develop your own pricing strategy for you and your brand.',
      link: 'https://creatorpricing.com',
    },
    {
      name: 'Creator Contract Builder',
      description: 'Build professional contracts tailored for creators — protect your work, set clear terms, and get paid with confidence.',
      link: 'https://creatorcontractbuilder.com/',
    },
    {
      name: 'Stella\'s Blog',
      description: 'Insights on creator economy, personal development and enhancing your skillset/knowledge as a creator in today\'s world.',
      link: 'https://paragraph.xyz/@stellaachenbach',
    },
  ];

  return (
    <>
      <SEO 
        title="Resources - Creator Branding Studio"
        description="Expert branding designers, brand guideline tools, and resources to help creators build their personal brand. Free tools and professional services."
        keywords="brand designers, branding experts, brand guidelines tools, personal branding resources, brand identity services, creator branding tools"
      />
      <div className="min-h-screen bg-[#FAFAF9] relative">
        {/* Static Dotted Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(19, 23, 24, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px',
          }}
        />
        
        <StudioHeader />
        
        {/* Left Navigation Toolbar */}
        <div className="absolute top-32 left-6 z-30 flex flex-col gap-3" data-zoom-control="true">
          {/* Back to Studio Button */}
          <div className="relative">
            <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
              {/* Glass Effect Layer */}
              <div 
                className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                style={{
                  backdropFilter: 'blur(3px)',
                  filter: 'url(#glass-distortion)',
                  isolation: 'isolate',
                }}
              />
              
              {/* Tint Layer */}
              <div 
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                }}
              />
              
              {/* Shine Layer */}
              <div 
                className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
                style={{
                  boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
                }}
              />
              
              {/* Content Layer */}
              <button
                className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
                onClick={() => navigate('/')}
                title="Home"
                aria-label="Home"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pl-24 pr-[24px] pt-0 -mt-[1.875rem] pb-0 relative z-10">
          {/* Page Title */}
          <div className="mb-12">
            
          </div>

          {/* Hire an Expert Section */}
          <section className="mb-16">
            <div 
              className="relative p-6 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] mb-6"
              style={{
                backgroundColor: 'rgba(254, 230, 234, 0.6)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Glass shine effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.4)',
                }}
              />
              
              <h3 className="text-xl sm:text-2xl font-semibold text-[#131718] mb-2 relative z-10">
                Hire an Expert
              </h3>
              <p className="text-[#131718] text-[16px] relative z-10">
                Connect with specialists from my and The ALANA Project's closer network who can bring your brand vision to life.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {experts.map((expert, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12)]"
                  style={{
                    backgroundColor: 'rgba(254, 230, 234, 0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Glass shine effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.4)',
                    }}
                  />
                  
                  {/* Profile Image */}
                  <div className="mb-4 relative z-10">
                    <ImageWithFallback
                      src={expert.image}
                      alt={expert.name}
                      className="w-20 h-20 rounded-[10px] object-cover border border-[#131718] grayscale"
                    />
                  </div>
                  
                  {/* Expert Info */}
                  <div className="mb-4 relative z-10">
                    <h4 className="text-lg font-semibold text-[#131718] mb-1 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 group-hover:after:w-full">
                      {expert.name}
                    </h4>
                    <p className="text-sm text-[#131718]/70 font-medium">
                      {expert.specialty}
                    </p>
                  </div>
                  
                  <p className="text-sm text-[#131718]/60 mb-6 relative z-10">
                    {expert.description}
                  </p>
                  
                  <a
                    href={expert.portfolio}
                    className="inline-flex items-center gap-2 text-sm text-[#131718] hover:text-[#131718]/70 transition-colors relative z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 group-hover:after:w-full"
                  >
                    View Portfolio
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Tools & Templates Section */}
          <section className="mb-16">
            <div 
              className="relative p-6 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] mb-6"
              style={{
                backgroundColor: 'rgba(254, 230, 234, 0.6)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Glass shine effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.4)',
                }}
              />
              
              <h3 className="text-xl sm:text-2xl font-semibold text-[#131718] mb-2 relative z-10">
                Tools & Templates
              </h3>
              <p className="text-[#131718] text-[16px] relative z-10">
                Free resources to help you build and refine your personal brand on your own.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12)]"
                  style={{
                    backgroundColor: 'rgba(254, 230, 234, 0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Glass shine effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.4)',
                    }}
                  />
                  
                  <a 
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block relative z-10"
                  >
                    <h4 className="text-lg font-semibold text-[#131718] mb-3 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 group-hover:after:w-full">
                      {tool.name}
                    </h4>
                  </a>
                  <p className="text-sm text-[#131718]/60 mb-6 relative z-10">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Supporting Tools Section */}
          <section className="mb-16">
            <div 
              className="relative p-6 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] mb-6"
              style={{
                backgroundColor: 'rgba(254, 230, 234, 0.6)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Glass shine effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.4)',
                }}
              />
              
              <h3 className="text-xl sm:text-2xl font-semibold text-[#131718] mb-2 relative z-10">
                Additional Help
              </h3>
              <p className="text-[#131718] text-[16px] relative z-10">
                Additional resources to enhance the making of your empire.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {supportingTools.map((tool, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.12)]"
                  style={{
                    backgroundColor: 'rgba(254, 230, 234, 0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Glass shine effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.4)',
                    }}
                  />
                  
                  <a 
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block relative z-10"
                  >
                    <h4 className="text-lg font-semibold text-[#131718] mb-3 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 group-hover:after:w-full">
                      {tool.name}
                    </h4>
                  </a>
                  <p className="text-sm text-[#131718]/60 mb-6 relative z-10">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Credits Footer - Full Width */}
        <div className="w-full border-t border-[#131718] mt-16 relative z-10">
          <div className="max-w-6xl mx-auto text-center p-[12px]">
            <p className="text-sm text-[#131718]">
              Made with 💜 by{' '}
              <a
                href="https://www.linkedin.com/in/stella-achenbach/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#131718] hover:text-[#131718]/70 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 hover:after:w-full font-bold"
              >
                @stellaachenbach
              </a>
            </p>
          </div>
        </div>

        {/* SVG Filter for Liquid Glass Effect */}
        <svg style={{ display: 'none' }}>
          <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="1"
              seed="5"
              result="turbulence"
            />

            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>

            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

            <feSpecularLighting
              in="softMap"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="100"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>

            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litImage"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="150"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </div>
    </>
  );
}