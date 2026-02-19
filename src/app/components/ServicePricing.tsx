import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Download, FileImage, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ServicePricingProps {
  targetIncome: number;
  billableHours: number;
}

interface ServiceOption {
  id: string;
  name: string;
  hoursOrScope: number;
  description: string;
}

export interface ServicePricingRef {
  downloadAsImage: () => Promise<void>;
  downloadAsPDF: () => Promise<void>;
}

export const ServicePricing = forwardRef<ServicePricingRef, ServicePricingProps>(
  ({ targetIncome, billableHours }, ref) => {
    const baseHourlyRate = billableHours > 0 ? targetIncome / billableHours : 0;
    const recommendedHourlyRate = baseHourlyRate * 1.25;

    const [markup, setMarkup] = useState(25);
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);

    const services: ServiceOption[] = [
      { id: "hourly", name: "Hourly Rate", hoursOrScope: 1, description: "Per hour of work" },
      { id: "small", name: "Small Project", hoursOrScope: 15, description: "15 hours" },
      { id: "medium", name: "Medium Project", hoursOrScope: 30, description: "30 hours" },
      { id: "large", name: "Large Project", hoursOrScope: 60, description: "60 hours" },
      { id: "day", name: "Day Rate", hoursOrScope: 8, description: "Full day (8 hours)" },
      { id: "retainer", name: "Monthly Retainer", hoursOrScope: 40, description: "40 hours/month" },
    ];

    const calculatePrice = (hours: number, isRetainer: boolean = false) => {
      const basePrice = baseHourlyRate * hours;
      const recommendedPrice = basePrice * (1 + markup / 100);
      const retainerDiscount = isRetainer ? 0.9 : 1; // 10% discount for retainers
      return {
        base: basePrice,
        recommended: recommendedPrice * retainerDiscount,
      };
    };

    const downloadAsImage = async () => {
      if (!downloadRef.current) {
        console.error('Download ref is null');
        return;
      }
      
      setIsDownloading(true);
      try {
        // Wait a moment for any fonts/styles to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(downloadRef.current, {
          backgroundColor: '#FEE6EA',
          scale: 2,
          logging: false,
          allowTaint: true,
          useCORS: false,
        });
        
        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas has zero dimensions');
        }
        
        const dataUrl = canvas.toDataURL('image/png');
        
        if (!dataUrl || dataUrl === 'data:,') {
          throw new Error('Canvas toDataURL returned empty');
        }
        
        const link = document.createElement('a');
        link.download = `pricing-calculator-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
        alert(`Error creating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsDownloading(false);
      }
    };

    const downloadAsPDF = async () => {
      if (!downloadRef.current) {
        console.error('Download ref is null');
        return;
      }
      
      setIsDownloading(true);
      try {
        // Wait a moment for any fonts/styles to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(downloadRef.current, {
          backgroundColor: '#FEE6EA',
          scale: 2,
          logging: false,
          allowTaint: true,
          useCORS: false,
        });
        
        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas has zero dimensions');
        }
        
        const imgData = canvas.toDataURL('image/png');
        
        if (!imgData || imgData === 'data:,') {
          throw new Error('Canvas toDataURL returned empty');
        }
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`pricing-calculator-${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert(`Error creating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsDownloading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      downloadAsImage,
      downloadAsPDF,
    }));

    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2">My Creator Pricing</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your minimum rates to cover all costs, and recommended rates with profit margin and safety buffer. <strong>All amounts in your currency.</strong>
          </p>
        </div>

        {/* Markup Input - Visible on Website */}
        <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="space-y-3">
            <Label htmlFor="markup" className="text-sm">
              Markup Percentage
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Input
                id="markup"
                type="number"
                inputMode="decimal"
                value={markup}
                onChange={(e) => setMarkup(parseFloat(e.target.value) || 25)}
                className="bg-input-background border border-border w-full sm:w-32"
              />
              <span className="text-xs sm:text-sm text-muted-foreground">
                25% is standard, use 50%+ for rush jobs or specialized work
              </span>
            </div>
          </div>
        </div>

        {/* Service Pricing Cards - Visible on Website */}
        <div className="space-y-3">
          {services.map((service) => {
            const isRetainer = service.id === "retainer";
            const prices = calculatePrice(service.hoursOrScope, isRetainer);

            return (
              <div
                key={service.id}
                className="backdrop-blur-2xl bg-card/60 border border-white/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-5 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] hover:border-white/30 transition-all duration-300"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h3 className="mb-1">{service.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{service.description}</p>
                    {isRetainer && (
                      <p className="text-xs text-muted-foreground mt-1">
                        10% discount applied for recurring work
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 sm:gap-8">
                    <div className="text-left flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Base Rate</div>
                      <div className="text-base sm:text-lg">
                        {prices.base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-muted-foreground">break-even</div>
                    </div>
                    <div className="text-left flex-1 backdrop-blur-xl bg-primary/5 px-3 sm:px-4 py-2 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Recommended</div>
                      <div className="text-base sm:text-lg text-primary">
                        {prices.recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-muted-foreground">+{markup}% profit</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Principles - Visible on Website */}
        <div className="backdrop-blur-xl bg-primary border border-primary/20 rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-primary-foreground">Key Principles</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/70">
            <li>• <strong className="text-primary-foreground">Never price below Base Rate</strong> — that's working for free</li>
            <li>• <strong className="text-primary-foreground">Recommended Rate is your starting point</strong> — you can charge more based on experience, reputation, and demand</li>
            <li>• <strong className="text-primary-foreground">Use higher markup for rush jobs</strong> — 50%+ for tight deadlines or high-visibility work</li>
            <li>• <strong className="text-primary-foreground">Retainers get discounts</strong> — recurring revenue is worth 10-15% off</li>
            <li>• <strong className="text-primary-foreground">Review quarterly</strong> — update as your expenses and skills grow</li>
          </ul>
        </div>

        {/* Hidden Download Content - Only Captured by html2canvas */}
        <div ref={downloadRef} style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          pointerEvents: 'none'
        }}>
          <div style={{ 
            width: '800px', 
            padding: '48px', 
            backgroundColor: '#FEE6EA',
            fontFamily: 'Work Sans, system-ui, sans-serif'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#131718',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
                textAlign: 'left'
              }}>
                My Creator Pricing
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: 'rgba(19, 23, 24, 0.6)',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Service Cards */}
            <div style={{ marginBottom: '32px' }}>
              {services.map((service, index) => {
                const isRetainer = service.id === "retainer";
                const prices = calculatePrice(service.hoursOrScope, isRetainer);

                return (
                  <div
                    key={service.id}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid rgba(19, 23, 24, 0.1)',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: index < services.length - 1 ? '12px' : '0'
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#131718',
                        marginBottom: '4px',
                        textAlign: 'left'
                      }}>
                        {service.name}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'rgba(19, 23, 24, 0.6)',
                        margin: 0,
                        textAlign: 'left'
                      }}>
                        {service.description}
                        {isRetainer && ' • 10% discount applied'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          marginBottom: '4px',
                          textAlign: 'left'
                        }}>
                          Base Rate
                        </div>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '600', 
                          color: '#131718',
                          textAlign: 'left'
                        }}>
                          {prices.base.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          textAlign: 'left'
                        }}>
                          break-even
                        </div>
                      </div>
                      <div style={{ 
                        flex: 1,
                        backgroundColor: '#FEE6EA',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '2px solid #131718'
                      }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          marginBottom: '4px',
                          textAlign: 'left'
                        }}>
                          Recommended
                        </div>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '700', 
                          color: '#131718',
                          textAlign: 'left'
                        }}>
                          {prices.recommended.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(19, 23, 24, 0.6)',
                          textAlign: 'left'
                        }}>
                          +{markup}% profit
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Principles */}
            <div style={{
              backgroundColor: '#131718',
              border: '1px solid rgba(19, 23, 24, 0.2)',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#FEE6EA',
                marginBottom: '16px',
                textAlign: 'left'
              }}>
                Key Principles
              </h3>
              <ul style={{ 
                margin: 0, 
                padding: 0, 
                listStyle: 'none',
                fontSize: '14px',
                color: 'rgba(254, 230, 234, 0.9)',
                lineHeight: '1.6',
                textAlign: 'left'
              }}>
                <li style={{ marginBottom: '8px' }}>
                  • <strong style={{ color: '#FEE6EA' }}>Never price below Base Rate</strong> — that's working for free
                </li>
                <li style={{ marginBottom: '8px' }}>
                  • <strong style={{ color: '#FEE6EA' }}>Recommended Rate is your starting point</strong> — you can charge more based on experience
                </li>
                <li style={{ marginBottom: '8px' }}>
                  • <strong style={{ color: '#FEE6EA' }}>Use higher markup for rush jobs</strong> — 50%+ for tight deadlines
                </li>
                <li style={{ marginBottom: '8px' }}>
                  • <strong style={{ color: '#FEE6EA' }}>Retainers get discounts</strong> — recurring revenue is worth 10-15% off
                </li>
                <li>
                  • <strong style={{ color: '#FEE6EA' }}>Review quarterly</strong> — update as your expenses and skills grow
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div style={{ 
              borderTop: '1px solid rgba(19, 23, 24, 0.1)',
              paddingTop: '24px',
              textAlign: 'left'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: 'rgba(19, 23, 24, 0.7)',
                margin: '0 0 8px 0',
                textAlign: 'left'
              }}>
                Share this calculator, use it, and adjust as your career grows.
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: 'rgba(19, 23, 24, 0.6)',
                margin: 0,
                textAlign: 'left'
              }}>
                Made with 💜 by @stellaachenbach
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ServicePricing.displayName = 'ServicePricing';