import { StudioHeader } from '@/app/components/studio/StudioHeader';
import { useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

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
      name: 'Brand Voice Guide Template',
      description: 'A comprehensive template for documenting your brand voice and tone.',
      link: '#',
    },
    {
      name: 'Visual Moodboard Kit',
      description: 'Curated collection of visual references to refine your aesthetic.',
      link: '#',
    },
    {
      name: 'Content Calendar Framework',
      description: 'Strategic planning tool aligned with your brand pillars.',
      link: '#',
    },
  ];

  const supportingTools = [
    {
      name: 'Creator Pricing Calculator',
      description: 'Calculate your rates and pricing strategy as a creator.',
      link: 'https://creatorpricing.com',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fee6ea]">
      <StudioHeader />
      
      <div className="max-w-6xl mx-auto px-[24px] pt-[12px] pb-0">
        {/* Back Button */}
        <button
          onClick={() => navigate('/studio')}
          className="group flex items-center gap-2 text-[#fee6ea] hover:text-[#fee6ea]/80 transition-colors mb-8"
        >
          
          
        </button>

        {/* Page Title */}
        <div className="mb-12">
          
          
        </div>

        {/* Hire an Expert Section */}
        <section className="mb-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#131718] mb-2">
            Hire an Expert
          </h3>
          <p className="mb-6 text-[#131718] text-[16px]">
            Connect with specialists from my and The ALANA Project's closer network who can bring your brand vision to life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {experts.map((expert, index) => (
              <div
                key={index}
                className="p-[0px]"
              >
                {/* Profile Image */}
                <div className="mb-4">
                  <ImageWithFallback
                    src={expert.image}
                    alt={expert.name}
                    className="w-20 h-20 rounded-[10px] object-cover border border-[#131718] grayscale"
                  />
                </div>
                
                {/* Expert Info */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-[#131718] mb-1 cursor-pointer hover:text-[#131718]/70 hover:scale-105 transition-all duration-200">
                    {expert.name}
                  </h4>
                  <p className="text-sm text-[#131718]/70 font-medium">
                    {expert.specialty}
                  </p>
                </div>
                
                <p className="text-sm text-[#131718]/60 mb-6">
                  {expert.description}
                </p>
                
                <a
                  href={expert.portfolio}
                  className="inline-flex items-center gap-2 text-sm text-[#131718] hover:text-[#131718]/70 transition-colors"
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
          <h3 className="text-xl sm:text-2xl font-semibold text-[#131718] mb-2">
            Tools & Templates
          </h3>
          <p className="mb-6 text-[#131718] text-[16px]">
            Free resources to help you build and refine your personal brand on your own.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="p-[0px]"
              >
                <h4 className="text-lg font-semibold text-[#131718] mb-3 cursor-pointer hover:text-[#131718]/70 hover:scale-105 transition-all duration-200">
                  {tool.name}
                </h4>
                <p className="text-sm text-[#131718]/60 mb-6">
                  {tool.description}
                </p>
                
              </div>
            ))}
          </div>
        </section>

        {/* Supporting Tools Section */}
        <section className="mb-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#131718] mb-2">
            Supporting Tools
          </h3>
          <p className="mb-6 text-[#131718] text-[16px]">
            Additional resources to enhance the making of your empire.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {supportingTools.map((tool, index) => (
              <div
                key={index}
                className="p-[0px]"
              >
                <h4 className="text-lg font-semibold text-[#131718] mb-3 cursor-pointer hover:text-[#131718]/70 hover:scale-105 transition-all duration-200">
                  {tool.name}
                </h4>
                <p className="text-sm text-[#131718]/60 mb-6">
                  {tool.description}
                </p>
                
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Credits Footer - Full Width */}
      <div className="w-full border-t border-[#131718] mt-16">
        <div className="max-w-6xl mx-auto text-center p-[12px]">
          <p className="text-sm text-[#131718]">
            Made with 💜 by{' '}
            <a
              href="https://www.linkedin.com/in/stella-achenbach/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#131718] hover:text-[#131718]/70 transition-colors"
            >
              @stellaachenbach
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}