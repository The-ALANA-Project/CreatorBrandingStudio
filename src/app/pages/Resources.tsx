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
      name: 'Stella\'s Blog',
      description: 'Insights on creator economy, personal development and enhancing your skillset/knowledge as a creator in today\'s world.',
      link: 'https://paragraph.xyz/@stellaachenbach',
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
                  <h4 className="text-lg font-semibold text-[#131718] mb-1 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 hover:after:w-full">
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
                  className="inline-flex items-center gap-2 text-sm text-[#131718] hover:text-[#131718]/70 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 hover:after:w-full"
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
                <a 
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <h4 className="text-lg font-semibold text-[#131718] mb-3 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 hover:after:w-full">
                    {tool.name}
                  </h4>
                </a>
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
            Additional Help
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
                <a 
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <h4 className="text-lg font-semibold text-[#131718] mb-3 cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 hover:after:w-full">
                    {tool.name}
                  </h4>
                </a>
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
              className="text-[#131718] hover:text-[#131718]/70 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#131718] after:transition-all after:duration-300 hover:after:w-full"
            >
              @stellaachenbach
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}