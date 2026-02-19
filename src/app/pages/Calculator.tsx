import { useState, useRef, useEffect } from "react";
import { ExpenseInput, type Expense } from "@/app/components/ExpenseInput";
import { IncomeCalculator, type IncomeSettings } from "@/app/components/IncomeCalculator";
import { ServicePricing, type ServicePricingRef } from "@/app/components/ServicePricing";
import { Button } from "@/app/components/ui/button";
import { FileImage, FileText, Upload, Download } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Link } from "react-router";

interface CalculatorData {
  expenses: Expense[];
  incomeSettings: IncomeSettings;
  exportDate: string;
  version: string;
}

const DEFAULT_EXPENSES: Expense[] = [
  { id: crypto.randomUUID(), category: "Housing", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Food", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Transport", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Health", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Internet", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Software", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "AI Tooling", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Equipment", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Subscriptions", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Professional", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Leisure", monthlyCost: 0 },
  { id: crypto.randomUUID(), category: "Misc", monthlyCost: 0 },
];

const DEFAULT_INCOME_SETTINGS: IncomeSettings = {
  taxRate: 30,
  emergencyBuffer: 20,
  reinvestment: 10,
  weeksPerYear: 48,
  daysPerWeek: 3,
  hoursPerDay: 4,
};

const STORAGE_KEY = 'creatorPricingData';

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
  const [incomeSettings, setIncomeSettings] = useState<IncomeSettings>(DEFAULT_INCOME_SETTINGS);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const servicePricingRef = useRef<ServicePricingRef>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.incomeSettings) setIncomeSettings(parsed.incomeSettings);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      expenses,
      incomeSettings,
      currentStep,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [expenses, incomeSettings, currentStep]);

  // Scroll detection for sticky header
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Export data as JSON
  const exportData = () => {
    const data: CalculatorData = {
      expenses,
      incomeSettings,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creator-pricing-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: CalculatorData = JSON.parse(content);
        
        // Validate structure
        if (!data.expenses || !data.incomeSettings) {
          alert('Invalid file format. Please upload a valid Creator Pricing data file.');
          return;
        }
        
        // Restore data
        setExpenses(data.expenses);
        setIncomeSettings(data.incomeSettings);
        alert('Data imported successfully! 🎉');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error reading file. Please ensure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      importData(file);
    } else {
      alert('Please upload a JSON file.');
    }
  };

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const totalMonthlyExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.monthlyCost || 0),
    0
  );
  const totalAnnualExpenses = totalMonthlyExpenses * 12;

  const taxAmount = totalAnnualExpenses * (incomeSettings.taxRate / 100);
  const bufferAmount = totalAnnualExpenses * (incomeSettings.emergencyBuffer / 100);
  const reinvestmentAmount = totalAnnualExpenses * (incomeSettings.reinvestment / 100);
  const targetIncome = totalAnnualExpenses + taxAmount + bufferAmount + reinvestmentAmount;

  const billableHoursPerYear =
    incomeSettings.weeksPerYear *
    incomeSettings.daysPerWeek *
    incomeSettings.hoursPerDay;

  // Scroll to top when changing steps
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { number: 1, title: "Monthly Expenses", description: "Add your costs" },
    { number: 2, title: "Income Calculator", description: "Set your parameters" },
    { number: 3, title: "Service Pricing", description: "See your rates" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header 
        className={`
          backdrop-blur-2xl bg-primary/95 border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
          transition-all duration-500 ease-out
          ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 py-3 sm:py-4' : 'py-8 sm:py-12'}
        `}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`
            transition-all duration-500 ease-out
            ${isScrolled ? 'opacity-0 max-h-0 overflow-hidden mb-0' : 'opacity-100 max-h-96 mb-6 sm:mb-8'}
          `}>
            <h1 className="mb-3 sm:mb-4 text-primary-foreground">Creator Pricing Calculator</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
              <p className="text-sm sm:text-base text-[#FEE6EA]/90 max-w-2xl">
                Calculate your sustainable creator rates based on real expenses, taxes, and business needs.
                Built with the financial wisdom every creative professional deserves.
              </p>
              <Link to="/resources">
                <Button 
                  variant="ghost" 
                  className="bg-[#FEE6EA] text-[#131718] hover:bg-[#131718] hover:text-[#FEE6EA] border border-[#FEE6EA] whitespace-nowrap self-start sm:self-auto transition-all duration-300"
                >
                  Resources →
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepChange(step.number)}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    currentStep === step.number 
                      ? 'opacity-100' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-colors duration-300
                    ${currentStep === step.number 
                      ? 'bg-[#FEE6EA] text-primary' 
                      : 'bg-[#FEE6EA]/20 text-[#FEE6EA]'
                    }
                  `}>
                    {step.number}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-primary-foreground">{step.title}</div>
                    <div className="text-xs text-[#FEE6EA]/70">{step.description}</div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-[#FEE6EA]/20 mx-2 sm:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Add padding top when header is sticky to prevent content jump */}
      <div className={`transition-all duration-500 ease-out ${isScrolled ? 'pt-20 sm:pt-24' : ''}`}>
        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          {/* Step 1 */}
          {currentStep === 1 && (
            <>
              {/* Load Data Section - Shows First */}
              <div className="mb-6 backdrop-blur-2xl bg-primary/5 border border-primary/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-6">
                <h3 className="mb-2">Load Saved Data</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Already have your data? Import your previously saved JSON file to continue where you left off.
                </p>
                
                {/* Drag and Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`
                    border-2 border-dashed rounded-lg p-6 sm:p-8 text-center
                    transition-all duration-300
                    ${isDragging 
                      ? 'border-primary bg-primary/10 scale-[1.02]' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }
                  `}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm mb-2">
                    {isDragging ? 'Drop your file here' : 'Drag and drop your JSON file here'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">or</p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="border-border cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <ExpenseInput expenses={expenses} onExpensesChange={setExpenses} />
                  <div className="mt-6 sm:mt-8 flex justify-end">
                    <Button onClick={() => handleStepChange(2)}>Next Step</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <IncomeCalculator
                  totalAnnualExpenses={totalAnnualExpenses}
                  settings={incomeSettings}
                  onSettingsChange={setIncomeSettings}
                />
                <div className="mt-6 sm:mt-8 flex justify-between">
                  <Button onClick={() => handleStepChange(1)}>Previous Step</Button>
                  <Button onClick={() => handleStepChange(3)}>Next Step</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <Card className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <ServicePricing
                  targetIncome={targetIncome}
                  billableHours={billableHoursPerYear}
                  ref={servicePricingRef}
                />
                <div className="mt-6 sm:mt-8 flex justify-between">
                  <Button onClick={() => handleStepChange(2)}>Previous Step</Button>
                  <Button onClick={() => handleStepChange(1)}>Start Over</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Reminder for Step 3 */}
          {currentStep === 3 && (
            <>
              <div className="mt-6 backdrop-blur-2xl bg-primary/5 border border-primary/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <h3 className="mb-1">Don't forget to save your calculations!</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Save your data as JSON to quickly re-import and update your rates next time. Or download as PNG/PDF to share with clients.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={exportData}
                      variant="default"
                      className="w-full sm:flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save Data (JSON)
                    </Button>
                    <Button
                      onClick={() => servicePricingRef.current?.downloadAsImage()}
                      variant="outline"
                      className="border-border w-full sm:flex-1"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Download as PNG
                    </Button>
                    <Button
                      onClick={() => servicePricingRef.current?.downloadAsPDF()}
                      variant="outline"
                      className="border-border w-full sm:flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download as PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* Resources Promotion Card */}
              <Link to="/resources">
                <Card className="mt-6 backdrop-blur-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">💡</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold mb-1">
                          Looking for more freelance tools?
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Check out our curated resources to help you advance your creative career beyond pricing.
                        </p>
                      </div>
                      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground px-4 pb-6 sm:pb-8">
          <p>
            Share this calculator, use it, and adjust as your career grows.{' '}
            <a 
              href="https://github.com/The-ALANA-Project/CreatorPricingCalculator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Source on GitHub
            </a>
          </p>
          <p className="mt-2">
            Made with 💜 by{' '}
            <a 
              href="https://www.linkedin.com/in/stella-achenbach/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @stellaachenbach
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}