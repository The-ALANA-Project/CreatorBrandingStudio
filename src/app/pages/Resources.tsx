import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ExternalLink, ArrowLeft, BookOpen, FileText, Users } from "lucide-react";
import { Link } from "react-router";

export default function Resources() {
  const resources = [
    {
      category: "Tools",
      icon: FileText,
      items: [
        {
          title: "Freelance Rate Guide",
          description: "Auto-generate polite forms of saying no to unpaid jobs. Often freelancers struggle to say no because they fear missing out on opportunities and lack more refined wording. Shivani's Freelance Rate Guide helps you to find the right wording in seconds to reply confidently to DM's, Emails and more.",
          url: "https://www.freelancerateguide.com/",
          author: "Shivani Shah",
          authorUrl: "https://www.linkedin.com/in/wordsbyshivani/",
        },
      ],
    },
    // More categories can be added here in the future
    // {
    //   category: "Books",
    //   icon: BookOpen,
    //   items: []
    // },
    // {
    //   category: "Communities",
    //   icon: Users,
    //   items: []
    // },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="backdrop-blur-2xl bg-primary/95 border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="mb-6 text-[#FEE6EA] hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 -ml-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Calculator
            </Button>
          </Link>
          <h1 className="mb-3 sm:mb-4 text-primary-foreground">Resources for Creators</h1>
          <p className="text-sm sm:text-base text-[#FEE6EA]/90 max-w-2xl">
            Curated tools, guides, and resources to help you advance your creative career beyond just pricing.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {resources.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <IconComponent className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl sm:text-3xl font-semibold">{section.category}</h2>
                </div>

                <div className="grid gap-6">
                  {section.items.map((item) => (
                    <Card 
                      key={item.title}
                      className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.15)] transition-all duration-300"
                    >
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            {item.author && (
                              <p className="text-sm text-muted-foreground">
                                Created by{" "}
                                <a 
                                  href={item.authorUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium"
                                >
                                  {item.author}
                                </a>
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <a 
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button className="w-full sm:w-auto">
                                Visit Tool
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Coming Soon Section */}
          <Card className="backdrop-blur-2xl bg-primary/5 border border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">More Resources Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                We're continuously adding helpful resources for freelancers and creators. Check back soon for books, templates, communities, and more!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4 pb-6 sm:pb-8">
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
  );
}