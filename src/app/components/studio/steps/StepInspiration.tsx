import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { ExternalLink, Image as ImageIcon, Link2, Plus } from 'lucide-react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepInspirationProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

interface PlatformCategory {
  name: string;
  url: string;
}

interface InspirationPlatform {
  id: string;
  name: string;
  description: string;
  logoColor: string;
  bgColor: string;
  categories: PlatformCategory[];
  url: string;
  inspirationFor: string;
}

export function StepInspiration({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepInspirationProps) {
  const [visitedCategories, setVisitedCategories] = useState<string[]>([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [savedLinks, setSavedLinks] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'embed'>('url');

  // Load saved data only on mount
  useEffect(() => {
    if (journeyData.inspiration && !isInitialized) {
      setVisitedCategories(journeyData.inspiration.visitedCategories || []);
      setSavedLinks(journeyData.inspiration.savedLinks || []);
      setIsInitialized(true);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (isInitialized) {
      onUpdateJourneyData('inspiration', {
        visitedCategories,
        savedLinks,
      });
    }
  }, [visitedCategories, savedLinks, isInitialized]);

  const platforms: InspirationPlatform[] = [
    {
      id: 'unsplash',
      name: 'Unsplash',
      description: 'High-quality stock photography',
      logoColor: '#000000',
      bgColor: '#000000',
      categories: [],
      url: 'https://unsplash.com/',
      inspirationFor: 'Photographers, Fashion Designers, Make-Up Artists, Graphic Designers and more',
    },
    {
      id: 'dribbble',
      name: 'Dribbble',
      description: 'UI/UX and digital design inspiration',
      logoColor: '#EA4C89',
      bgColor: '#EA4C89',
      categories: [],
      url: 'https://dribbble.com/',
      inspirationFor: 'UI/UX Designers, Product Designers, App Developers, Illustrators and more',
    },
    {
      id: 'artstation',
      name: 'ArtStation',
      description: 'Professional artwork and 3D design',
      logoColor: '#13AFF0',
      bgColor: '#13AFF0',
      categories: [],
      url: 'https://www.artstation.com/',
      inspirationFor: '3D Artists, Texture Artists, Matte Painters, Concept Artists and more',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      description: 'Mood boards and visual collections',
      logoColor: '#E60023',
      bgColor: '#E60023',
      categories: [],
      url: 'https://www.pinterest.com/homefeed/',
      inspirationFor: 'Visual Stylists, Interior Designers, Event Planners, Creative Directors and more',
    },
    {
      id: 'minimal-gallery',
      name: 'Minimal Gallery',
      description: 'Curated minimalist design showcase',
      logoColor: '#000000',
      bgColor: '#000000',
      categories: [],
      url: 'https://minimal.gallery/',
      inspirationFor: 'UI/UX Designers, Brand Designers, Web Designers, Minimalist Enthusiasts and more',
    },
    {
      id: 'logobook',
      name: 'Logobook',
      description: 'Logo design inspiration library',
      logoColor: '#FF6B35',
      bgColor: '#FF6B35',
      categories: [],
      url: 'https://www.logobook.com/',
      inspirationFor: 'Brand Designers, Logo Designers, Identity Designers, Visual Artists and more',
    },
    {
      id: 'branding-style-guides',
      name: 'Branding Style Guides',
      description: 'Real brand guidelines collection',
      logoColor: '#6C5CE7',
      bgColor: '#6C5CE7',
      categories: [],
      url: 'https://brandingstyleguides.com/',
      inspirationFor: 'Brand Strategists, Design Directors, Marketing Teams, Design System Architects and more',
    },
    {
      id: 'awwwards',
      name: 'Awwwards',
      description: 'Award-winning web design',
      logoColor: '#000000',
      bgColor: '#000000',
      categories: [],
      url: 'https://www.awwwards.com/',
      inspirationFor: 'Web Designers, Creative Directors, Digital Agencies, Front-End Developers and more',
    },
    {
      id: 'siteinspire',
      name: 'SiteInspire',
      description: 'Web design showcase',
      logoColor: '#FF3366',
      bgColor: '#FF3366',
      categories: [],
      url: 'https://www.siteinspire.com/',
      inspirationFor: 'Web Designers, UI/UX Designers, Digital Designers, Creative Agencies and more',
    },
    {
      id: 'lapa-ninja',
      name: 'Lapa Ninja',
      description: 'Landing page design gallery',
      logoColor: '#FF4757',
      bgColor: '#FF4757',
      categories: [],
      url: 'https://www.lapa.ninja/',
      inspirationFor: 'Landing Page Designers, Conversion Optimizers, Marketing Designers, Startups and more',
    },
    {
      id: 'land-book',
      name: 'Land-book',
      description: 'Product landing page gallery',
      logoColor: '#2ECC71',
      bgColor: '#2ECC71',
      categories: [],
      url: 'https://land-book.com/',
      inspirationFor: 'Product Designers, SaaS Marketers, Web Designers, Growth Teams and more',
    },
    {
      id: 'one-page-love',
      name: 'One Page Love',
      description: 'One-page website inspiration',
      logoColor: '#FF6B6B',
      bgColor: '#FF6B6B',
      categories: [],
      url: 'https://onepagelove.com/',
      inspirationFor: 'Freelancers, Portfolio Designers, Single-Page Advocates, Minimalist Designers and more',
    },
    {
      id: 'footer-design',
      name: 'Footer Design',
      description: 'Website footer inspiration',
      logoColor: '#4A90E2',
      bgColor: '#4A90E2',
      categories: [],
      url: 'https://www.footer.design/',
      inspirationFor: 'Web Designers, UI Designers, UX Researchers, Information Architects and more',
    },
    {
      id: 'rawpixel',
      name: 'Rawpixel',
      description: 'Free design resources and illustrations',
      logoColor: '#FF6B35',
      bgColor: '#FF6B35',
      categories: [],
      url: 'https://www.rawpixel.com/',
      inspirationFor: 'Graphic Designers, Illustrators, Content Creators, Marketing Teams and more',
    },
  ];

  const handleCategoryClick = (platformId: string, categoryName: string) => {
    const categoryKey = `${platformId}-${categoryName}`;
    if (!visitedCategories.includes(categoryKey)) {
      setVisitedCategories(prev => [...prev, categoryKey]);
    }
    window.open(platforms.find(p => p.id === platformId)?.categories.find(c => c.name === categoryName)?.url, '_blank', 'noopener,noreferrer');
  };

  // Extract domain and title from any URL
  const extractUrlInfo = (url: string): { domain: string; title: string; displayUrl: string } => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Extract title from path
      let title = 'Reference Link';
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (domain.includes('behance.net')) {
        const match = url.match(/\/gallery\/\d+\/([\w-]+)/);
        if (match && match[1]) {
          title = match[1].split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      } else if (pathParts.length > 0) {
        // Use last path part as title
        title = pathParts[pathParts.length - 1]
          .split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
      }
      
      return {
        domain,
        title,
        displayUrl: `${domain}${urlObj.pathname.substring(0, 40)}${urlObj.pathname.length > 40 ? '...' : ''}`,
      };
    } catch (e) {
      return {
        domain: 'Unknown',
        title: 'Reference Link',
        displayUrl: url.substring(0, 50),
      };
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(linkUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // Check if this is a direct image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'];
    const isDirectImage = imageExtensions.some(ext => linkUrl.toLowerCase().includes(ext));

    if (isDirectImage) {
      // Handle as direct image
      const urlObj = new URL(linkUrl);
      const domain = urlObj.hostname.replace('www.', '');
      const filename = urlObj.pathname.split('/').pop() || 'Image';
      const title = filename.split('.')[0].split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      const linkData = {
        url: linkUrl,
        domain,
        title,
        displayUrl: `${domain}/${filename}`,
        image: linkUrl,
        timestamp: Date.now(),
      };

      setSavedLinks(prev => [...prev, linkData]);

      onAddItem({
        type: 'link',
        content: {
          url: linkUrl,
          title,
          domain,
          displayUrl: linkData.displayUrl,
          image: linkUrl,
        },
      });

      setLinkUrl('');
      return;
    }

    setIsLoadingPreview(true);

    // Fetch metadata and preview image
    fetchLinkPreview(linkUrl)
      .then((previewData) => {
        const linkData = {
          url: linkUrl,
          domain: previewData.domain,
          title: previewData.title,
          displayUrl: previewData.displayUrl,
          image: previewData.image,
          description: previewData.description,
          timestamp: Date.now(),
        };

        // Save to state
        setSavedLinks(prev => [...prev, linkData]);

        // Add to canvas immediately as a link preview card with image
        onAddItem({
          type: 'link',
          content: {
            url: linkUrl,
            title: previewData.title,
            domain: previewData.domain,
            displayUrl: previewData.displayUrl,
            image: previewData.image,
            description: previewData.description,
          },
        });

        // Clear input
        setLinkUrl('');
      })
      .catch((error) => {
        console.error('Failed to fetch preview:', error);
        // Fallback to basic URL info
        const { domain, title, displayUrl } = extractUrlInfo(linkUrl);
        const linkData = {
          url: linkUrl,
          domain,
          title,
          displayUrl,
          timestamp: Date.now(),
        };

        setSavedLinks(prev => [...prev, linkData]);

        onAddItem({
          type: 'link',
          content: {
            url: linkUrl,
            title,
            domain,
            displayUrl,
          },
        });

        setLinkUrl('');
      })
      .finally(() => {
        setIsLoadingPreview(false);
      });
  };

  // Fetch link preview using microlink.io free API
  const fetchLinkPreview = async (url: string): Promise<{
    domain: string;
    title: string;
    displayUrl: string;
    image?: string;
    description?: string;
  }> => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Use microlink.io with simplified parameters for better success rate
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&palette=false&audio=false&video=false`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Microlink API returned ${response.status}, using fallback`);
        return extractUrlInfo(url);
      }

      const data = await response.json();

      console.log('Microlink response for', url, ':', data);

      if (data.status === 'success' && data.data) {
        // Prioritize the largest, most relevant image
        let imageUrl = undefined;
        
        // 1. First try: og:image or main image (usually the hero/cover image)
        if (data.data.image?.url) {
          imageUrl = data.data.image.url;
          console.log('Using og:image:', imageUrl);
        }
        
        // 2. Try screenshot for visual preview
        if (!imageUrl && data.data.screenshot?.url) {
          imageUrl = data.data.screenshot.url;
          console.log('Using screenshot:', imageUrl);
        }
        
        // 3. Last resort: use logo if it's reasonably sized
        if (!imageUrl && data.data.logo?.url) {
          const logoWidth = data.data.logo?.width || 0;
          const logoHeight = data.data.logo?.height || 0;
          
          if (logoWidth > 100 || logoHeight > 100) {
            imageUrl = data.data.logo.url;
            console.log('Using logo:', imageUrl);
          }
        }

        console.log('Final image URL:', imageUrl);
        
        return {
          domain,
          title: data.data.title || extractUrlInfo(url).title,
          displayUrl: `${domain}${urlObj.pathname.substring(0, 40)}${urlObj.pathname.length > 40 ? '...' : ''}`,
          image: imageUrl,
          description: data.data.description,
        };
      } else {
        console.warn('Microlink returned unsuccessful status:', data.status);
        return extractUrlInfo(url);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      // Fallback to basic extraction
      return extractUrlInfo(url);
    }
  };

  // Specialized Behance preview fetcher
  const fetchBehancePreview = async (url: string): Promise<{
    domain: string;
    title: string;
    displayUrl: string;
    image?: string;
    description?: string;
  } | null> => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Extract project ID from URL
      const projectIdMatch = url.match(/\/gallery\/(\d+)/);
      if (!projectIdMatch) return null;
      
      const projectId = projectIdMatch[1];
      
      // Try to fetch via CORS proxy to get the actual HTML
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`);
      const html = await response.text();
      
      // Parse HTML to find Open Graph image and title
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
      const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
      const ogDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
      
      // Also try to find Behance API data embedded in the page
      const beApiMatch = html.match(/window\.__be_initialData\s*=\s*({.+?});/);
      
      let imageUrl = ogImageMatch ? ogImageMatch[1] : undefined;
      let title = ogTitleMatch ? ogTitleMatch[1] : extractUrlInfo(url).title;
      let description = ogDescMatch ? ogDescMatch[1] : undefined;
      
      // If we found the Behance API data, try to extract cover image from there
      if (beApiMatch && !imageUrl) {
        try {
          const apiData = JSON.parse(beApiMatch[1]);
          // Behance API data structure: project.covers (array of cover images)
          const covers = apiData?.project?.covers;
          if (covers && covers.length > 0) {
            // Get the largest cover (usually last in array)
            const largestCover = covers[covers.length - 1];
            imageUrl = largestCover?.url || largestCover?.src;
          }
        } catch (e) {
          console.warn('Failed to parse Behance API data:', e);
        }
      }
      
      return {
        domain,
        title,
        displayUrl: `${domain}${urlObj.pathname.substring(0, 40)}${urlObj.pathname.length > 40 ? '...' : ''}`,
        image: imageUrl,
        description,
      };
    } catch (error) {
      console.error('Behance-specific fetch failed:', error);
      return null;
    }
  };

  // Parse embed code to extract image and link
  const parseEmbedCode = (embedHtml: string): {
    imageUrl?: string;
    linkUrl?: string;
    title?: string;
    domain?: string;
  } | null => {
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(embedHtml, 'text/html');
      
      // Find image tag
      const img = doc.querySelector('img');
      const imageUrl = img?.getAttribute('src') || undefined;
      
      // Find anchor tag for link
      const anchor = doc.querySelector('a');
      const linkUrl = anchor?.getAttribute('href') || undefined;
      const altText = img?.getAttribute('alt') || anchor?.getAttribute('alt') || undefined;
      
      if (!imageUrl && !linkUrl) {
        return null;
      }
      
      // Extract domain and title from link or alt text
      let domain = 'Unknown';
      let title = altText || 'Embedded Reference';
      
      if (linkUrl) {
        const urlObj = new URL(linkUrl);
        domain = urlObj.hostname.replace('www.', '');
        
        // Try to extract title from alt text or URL
        if (altText) {
          // Remove "by [author] on [platform]" pattern
          title = altText.replace(/\s+by\s+.+?\s+on\s+.+$/i, '').trim() || title;
        }
      }
      
      return {
        imageUrl,
        linkUrl,
        title,
        domain,
      };
    } catch (error) {
      console.error('Error parsing embed code:', error);
      return null;
    }
  };

  const handleAddEmbed = () => {
    if (!embedCode.trim()) return;
    
    const parsed = parseEmbedCode(embedCode);
    
    if (!parsed) {
      alert('Could not parse embed code. Please check the format.');
      return;
    }
    
    const { imageUrl, linkUrl, title, domain } = parsed;
    
    const linkData = {
      url: linkUrl || '',
      domain: domain || 'embed',
      title: title || 'Embedded Reference',
      displayUrl: linkUrl ? `${domain}${new URL(linkUrl).pathname.substring(0, 40)}` : 'Embedded content',
      image: imageUrl,
      timestamp: Date.now(),
    };
    
    // Save to state
    setSavedLinks(prev => [...prev, linkData]);
    
    // Add to canvas
    onAddItem({
      type: 'link',
      content: {
        url: linkUrl || '',
        title: title || 'Embedded Reference',
        domain: domain || 'embed',
        displayUrl: linkData.displayUrl,
        image: imageUrl,
      },
    });
    
    // Clear input
    setEmbedCode('');
  };

  const handleContinue = () => {
    // Add a summary card to canvas
    onAddItem({
      type: 'card',
      content: {
        title: 'Visual References',
        description: 'Explore inspiration sources, copy image URLs, and add them using the floating toolbar',
        tags: platforms.map(p => p.name),
      },
    });
    
    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Gather Visual Inspiration</h2>
        <p className="text-muted-foreground">
          Browse pages like Pinterest, Unsplash, and Behance for additional inspiration. Use the add reference function below to add individual sources of inspiration directly to your canvas brief.
        </p>
      </div>

      {/* Instructions */}
      

      {/* Platforms & Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Browse Inspiration Platforms
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {platforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card/40 backdrop-blur-2xl border border-border rounded-lg p-4 hover:border-[#131718] hover:bg-[#FEE6EA]/10 transition-all group"
            >
              {/* Platform Header */}
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: platform.logoColor }}
                >
                  {platform.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-semibold">{platform.name}</h4>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#131718] transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{platform.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Resource of inspiration for:</span> {platform.inspirationFor}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Add Link */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Save References
          </h3>
        </div>
        <div className="bg-[#FEE6EA]/20 border border-[#131718]/10 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Paste project URLs to save them as clickable reference cards on your canvas. Ideally collect no more than 5-8 references that represent your desired visual direction.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const pastedText = e.clipboardData.getData('text');
                setLinkUrl(pastedText);
              }}
              onKeyDown={(e) => {
                // Allow Cmd+A / Ctrl+A for select all - don't interfere with it
                if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'a')) {
                  // Let the browser handle it
                  return;
                }
                if (e.key === 'Enter') {
                  handleAddLink();
                }
              }}
              placeholder="https://www.pinterest.com/pin/..."
              className="flex-1 px-4 py-2.5 bg-card/80 backdrop-blur-2xl border border-border rounded-lg text-sm focus:outline-none focus:border-[#131718] transition-colors"
              disabled={isLoadingPreview}
            />
            <button
              onClick={handleAddLink}
              disabled={!linkUrl.trim() || isLoadingPreview}
              className="px-4 py-2.5 bg-[#131718] text-white rounded-lg text-sm font-medium hover:bg-[#131718]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoadingPreview ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
          
          {savedLinks.length > 0 && (
            null
          )}
        </div>
      </div>

      {/* Add Embed */}
      

      {/* Tips */}
      

      <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {visitedCategories.length} source{visitedCategories.length !== 1 ? 's' : ''} explored
        </p>
        <Button onClick={handleContinue}>
          Continue →
        </Button>
      </div>
    </div>
  );
}