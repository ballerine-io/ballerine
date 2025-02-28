import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@ballerine/ui';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Ban,
  Search,
  UserCheck,
  Building,
  ExternalLink,
  Link,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const AITechIcon = () => {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-300/30">
      <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20" />
      <Brain className="relative h-6 w-6 text-white" />
    </div>
  );
};

const TypewriterText = ({ text, delay = 15 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-purple-500"></span>
      )}
    </span>
  );
};

const ActionButton = ({
  icon: Icon,
  label,
  onClick = () => {
    /* no-op default */
  },
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => {
  const [showPremiumTooltip, setShowPremiumTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-md border border-indigo-200 px-3 py-1.5 text-sm text-indigo-700 transition-colors hover:bg-indigo-50"
        onClick={onClick}
        onMouseEnter={() => setShowPremiumTooltip(true)}
        onMouseLeave={() => setShowPremiumTooltip(false)}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </button>

      {showPremiumTooltip && (
        <div className="animate-fade-in absolute bottom-full left-0 z-50 mb-1 w-56 rounded-md border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-2 text-xs shadow-lg">
          <div className="flex items-center gap-1.5 text-amber-700">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium">Premium feature</span>
          </div>
          <p className="mt-1 text-gray-600">Upgrade your plan to unlock this action</p>
        </div>
      )}
    </div>
  );
};

const RiskIndicator = ({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) => {
  let color = 'bg-green-500';
  let textColor = 'text-green-700';
  let label = 'Low';

  if (score > 80) {
    color = 'bg-red-500';
    textColor = 'text-red-700';
    label = 'High';
  } else if (score > 50) {
    color = 'bg-yellow-500';
    textColor = 'text-yellow-700';
    label = 'Medium';
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${color} h-2.5 w-2.5 rounded-full`} />
      <span className={`font-semibold ${textColor} ${sizeClasses[size]}`}>
        {label} Risk ({score}/100)
      </span>
    </div>
  );
};

interface Finding {
  text: string;
  source?: {
    label: string;
    tooltip: string;
  };
}

type BulletContent = Finding[];
type SectionContent = string | BulletContent;

interface Section {
  type: 'paragraph' | 'heading' | 'bullets';
  content: SectionContent;
}

const FindingWithSource = ({ finding }: { finding: Finding }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  if (!finding.source) {
    return <span>{finding.text}</span>;
  }

  return (
    <span className="group relative">
      {finding.text}{' '}
      <button
        className="inline-flex items-center text-indigo-600 transition-colors hover:text-indigo-800"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Link className="h-3.5 w-3.5" />
        <span className="ml-0.5 text-xs">{finding.source.label}</span>
      </button>
      {isTooltipVisible && (
        <div className="absolute -bottom-1 left-0 z-50 w-72 translate-y-full rounded-md border border-gray-200 bg-white p-2 text-xs shadow-lg">
          <p className="text-gray-700">{finding.source.tooltip}</p>
        </div>
      )}
    </span>
  );
};

const AISummaryContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(-1);
  const [activeBullet, setActiveBullet] = useState(-1);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Generate a storage key based on the case name - in a real implementation,
  // this would use actual entity ID from the context
  const STORAGE_KEY = 'ai-summary-animation-shown-tech-solutions-ltd1';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections: Section[] = [
    {
      type: 'paragraph',
      content:
        'Based on comprehensive analysis of Tech Solutions Ltd case, this entity presents several risk factors requiring thorough review:',
    },
    { type: 'heading', content: '1) Risk Assessment: High (🔴 95/100)' },
    {
      type: 'bullets',
      content: [
        {
          text: 'Complex ownership structure with multiple offshore entities identified via UBO analysis',
          source: {
            label: 'UBO Data',
            tooltip:
              'UBO plugin detected 5 levels of corporate structure with Cayman Islands and offshore holdings. See full ownership graph for details.',
          },
        },
        {
          text: 'Company appears on sanctions monitoring list for "due diligence and compliance monitoring"',
          source: {
            label: 'Sanctions Check',
            tooltip:
              'Source: Company Sanctions plugin, matched on company name, country, and category. Listed for due diligence requirements on 2024-02-01.',
          },
        },
        {
          text: 'Website compliance issues detected - missing critical legal pages (T&C, Privacy Policy)',
          source: {
            label: 'Website Analysis',
            tooltip:
              'Merchant Monitoring plugin identified 4 missing pages: Terms & Conditions, Privacy Policy, About Us, and Contact Us. Risk score 63.',
          },
        },
      ],
    },
    { type: 'heading', content: '2) Key Compliance Concerns:' },
    {
      type: 'bullets',
      content: [
        {
          text: 'UBO Viktor Orlov connected through Cayman Financial Services (37.5% effective ownership)',
          source: {
            label: 'UBO Chain',
            tooltip:
              'Viktor Orlov owns 50% of Cayman Financial, which owns 75% of Offshore Holdings, which owns 60% of Tech Solutions. Calculated effective ownership: 22.5%.',
          },
        },
        {
          text: "Multiple matches found in Mastercard's merchant screening database",
          source: {
            label: 'Merchant Screening',
            tooltip:
              'Mastercard merchant screening identified 7 potential matches. Transaction reference: 19962024090205928.',
          },
        },
        {
          text: 'AML checks failed according to compliance records',
          source: {
            label: 'Custom Data',
            tooltip:
              'AML check status recorded as "failed" in customData.amlChecksPassed field. Last review: 2024-10-31.',
          },
        },
      ],
    },
    { type: 'heading', content: '3) Verification Status:' },
    {
      type: 'bullets',
      content: [
        {
          text: 'Document verification: Certificate of Incorporation appears authentic',
          source: {
            label: 'Documents',
            tooltip:
              'Certificate of Incorporation document was provided and appears valid. Registration number 12345678 matches with other records.',
          },
        },
        {
          text: 'Business registration details match Companies House records',
          source: {
            label: 'Business Info',
            tooltip:
              'Business Information plugin confirmed registration number 202400701R is valid and active since 2010-01-01.',
          },
        },
        {
          text: 'Discrepancy detected between registered address and operational address',
          source: {
            label: 'Address Check',
            tooltip:
              'Registered address (1 Tech Street, London) differs from the address on submitted documents (Unit 5, Innovation Park, Accra, Ghana).',
          },
        },
      ],
    },
    { type: 'heading', content: '4) Recommended Actions:' },
    {
      type: 'bullets',
      content: [
        {
          text: 'Perform enhanced due diligence on Viktor Orlov and other UBOs',
          source: {
            label: 'Recommendation',
            tooltip:
              'Based on PEP screening protocols and critical-risk jurisdictions involved in the ownership structure.',
          },
        },
        {
          text: 'Request clarification on sanctions list appearance',
          source: {
            label: 'Recommendation',
            tooltip:
              'Company should provide documentation explaining why they appear on monitoring lists and what remediation steps have been taken.',
          },
        },
        {
          text: 'Verify source of funds for initial capitalization ($1M)',
          source: {
            label: 'Recommendation',
            tooltip:
              'High transaction volume combined with offshore connections requires source of funds verification as per AML policy section 4.2.',
          },
        },
        {
          text: 'Require website compliance remediation before approval',
          source: {
            label: 'Recommendation',
            tooltip:
              'Website must include required legal pages (T&C, Privacy Policy, Contact, About) as per compliance requirements before approval.',
          },
        },
      ],
    },
  ];

  // Function to calculate actual progress percentage
  const calculateProgress = () => {
    if (isLoading) {
      return 0;
    }

    if (isComplete) {
      return 100;
    }

    // Calculate total bullets across all sections
    let totalBullets = 0;
    let completedContent = 0;

    // Count paragraphs and headings as 1 unit each
    const nonBulletSections = sections.filter(s => s.type !== 'bullets').length;

    // Count all bullet points
    sections.forEach(section => {
      if (section.type === 'bullets') {
        totalBullets += (section.content as BulletContent).length;
      }
    });

    // Calculate completed content
    // Completed sections (paragraphs + headings)
    const completedSections = Math.min(activeSection, sections.length);
    const completedNonBulletSections = sections
      .slice(0, completedSections)
      .filter(s => s.type !== 'bullets').length;

    // Add completed bullets from active section if it's a bullet section
    let completedBullets = 0;
    sections.forEach((section, idx) => {
      if (section.type === 'bullets') {
        if (idx < activeSection) {
          // All bullets in previous sections are complete
          completedBullets += (section.content as BulletContent).length;
        } else if (idx === activeSection) {
          // Add bullets completed in current section
          completedBullets += Math.min(activeBullet + 1, (section.content as BulletContent).length);
        }
      }
    });

    completedContent = completedNonBulletSections + completedBullets;
    const totalContent = nonBulletSections + totalBullets;

    // Calculate progress percentage
    return Math.min(Math.round((completedContent / totalContent) * 100), 99);
  };

  // Calculate progress percentage
  const progress = calculateProgress();

  // Check localStorage on initial render to see if we should skip the animation
  useEffect(() => {
    try {
      const animationShown = localStorage.getItem(STORAGE_KEY);

      if (animationShown === 'true') {
        // Skip animation
        setSkipAnimation(true);
        setIsLoading(false);
        setActiveSection(sections.length); // Set to end of sections
        setVisibleSections([...Array(sections.length).keys()]); // Show all sections
        setShowSummaryCard(true);
        setShowActions(true);
        setIsComplete(true);
      }
    } catch (error) {
      // If localStorage access fails, continue with normal animation
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Only run the loading animation if we're not skipping it
  useEffect(() => {
    if (skipAnimation) {
      return; // Skip the animation
    }

    // Extended loading time (5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
      setActiveSection(0);
      setVisibleSections([0]);
      // Show summary card immediately after loading
      setShowSummaryCard(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [skipAnimation]);

  // The main animation effect
  useEffect(() => {
    if (skipAnimation || isLoading || activeSection >= sections.length) {
      return;
    }

    const currentSection = sections[activeSection];

    // Add active section to visible sections if not already there
    if (!visibleSections.includes(activeSection)) {
      setVisibleSections(prev => [...prev, activeSection]);
    }

    if (currentSection?.type === 'bullets') {
      if (activeBullet < (currentSection.content as BulletContent).length - 1) {
        // If we're in a bullet list and not at the last bullet
        const bulletTimer = setTimeout(() => {
          setActiveBullet(prev => prev + 1);
        }, 1000); // Wait 1 second between bullets (faster)

        return () => clearTimeout(bulletTimer);
      } else {
        // If we've finished all bullets in this section
        const nextSectionTimer = setTimeout(() => {
          setActiveSection(prev => prev + 1);
          setActiveBullet(-1); // Reset bullet counter
        }, 500); // Wait half a second before moving to next section

        return () => clearTimeout(nextSectionTimer);
      }
    } else {
      // For paragraphs and headings, move to next section after text is typed
      // Estimate typing time based on content length (15ms per character + 500ms buffer)
      const typingTime = (currentSection?.content as string).length * 15 + 500;

      const nextSectionTimer = setTimeout(() => {
        setActiveSection(prev => prev + 1);
      }, typingTime);

      return () => clearTimeout(nextSectionTimer);
    }
  }, [isLoading, activeSection, activeBullet, sections, visibleSections, skipAnimation]);

  // Check if recommendations section is complete to show actions
  useEffect(() => {
    if (skipAnimation) {
      return; // Actions already shown if skipping animation
    }

    // Find the index of the recommendations section
    const recommendationsIndex = sections.findIndex(
      section =>
        section.type === 'heading' && (section.content as string).includes('Recommended Actions'),
    );

    // If we've completed the recommendations section, show actions
    if (recommendationsIndex !== -1 && activeSection > recommendationsIndex && !showActions) {
      setShowActions(true);
    }
  }, [activeSection, sections, showActions, skipAnimation]);

  // Set complete status when all sections are processed
  useEffect(() => {
    if (skipAnimation) {
      return; // Already complete if skipping animation
    }

    if (activeSection >= sections.length && !isComplete) {
      // Add a small delay to ensure last section is fully visible
      const completeTimer = setTimeout(() => {
        setIsComplete(true);

        // Mark the animation as shown in localStorage so it won't play again
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch (error) {
          console.error('Error setting localStorage:', error);
        }
      }, 1000);

      return () => clearTimeout(completeTimer);
    }
  }, [activeSection, sections.length, isComplete, skipAnimation]);

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16"
        style={{ minHeight: '350px' }}
      >
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-indigo-600 opacity-50 blur-md"></div>
          <div className="duration-3000 absolute inset-2 animate-spin rounded-full bg-gradient-to-r from-purple-500 to-indigo-700"></div>
          <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white">
            <Brain className="h-7 w-7 text-indigo-700" />
          </div>
        </div>
        <p className="mt-6 animate-pulse text-sm font-medium text-indigo-700">
          Analyzing case data...
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative space-y-4 text-sm transition-all duration-300 ease-in-out"
      style={{ minHeight: '350px' }}
    >
      {showSummaryCard && (
        <div className="mb-4 flex flex-col space-y-2 rounded-md bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-gray-800">Case Risk Summary: Tech Solutions Ltd</h3>
            </div>
            <RiskIndicator score={95} />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-white p-2">
              <span className="text-gray-500">Business Type</span>
              <p className="font-medium">Software Development (UK)</p>
            </div>
            <div className="rounded-md bg-white p-2">
              <span className="text-gray-500">Established</span>
              <p className="font-medium">2010 (14 years)</p>
            </div>
            <div className="rounded-md bg-white p-2">
              <span className="text-gray-500">Annual Volume</span>
              <p className="font-medium">£1,000,000</p>
            </div>
            <div className="rounded-md bg-white p-2">
              <span className="text-gray-500">UBO Check</span>
              <p className="font-medium text-red-600">Failed</p>
            </div>
          </div>
        </div>
      )}

      {sections.map((section, sectionIndex) => {
        // Only render sections that have been made visible
        if (!visibleSections.includes(sectionIndex)) {
          return null;
        }

        if (section.type === 'paragraph') {
          return (
            <p key={sectionIndex}>
              {sectionIndex === activeSection ? (
                <TypewriterText text={section.content as string} delay={12} />
              ) : (
                (section.content as string)
              )}
            </p>
          );
        }

        if (section.type === 'heading') {
          return (
            <div key={sectionIndex}>
              <strong>
                {sectionIndex === activeSection ? (
                  <TypewriterText text={section.content as string} delay={12} />
                ) : (
                  (section.content as string)
                )}
              </strong>
            </div>
          );
        }

        if (section.type === 'bullets') {
          const bulletContent = section.content as BulletContent;

          return (
            <div key={sectionIndex}>
              <ul className="list-disc pl-6 pt-1">
                {bulletContent.map((bullet, bulletIndex) => {
                  // Only render bullets that are active or have been shown already
                  const shouldShow =
                    sectionIndex < activeSection ||
                    (sectionIndex === activeSection && bulletIndex <= activeBullet);

                  if (!shouldShow) {
                    return null;
                  }

                  return (
                    <li key={bulletIndex}>
                      {sectionIndex === activeSection && bulletIndex === activeBullet ? (
                        <TypewriterText text={bullet.text} delay={10} />
                      ) : (
                        <FindingWithSource finding={bullet} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }

        return null;
      })}

      {/* Only show actions after recommendations are complete */}
      {showActions && (
        <div className="mt-8 space-y-4 rounded-md border border-indigo-100 bg-indigo-50 p-3 pt-4">
          <h4 className="flex items-center gap-2 font-medium text-indigo-700">
            <ArrowRight className="h-4 w-4" />
            Available Actions
          </h4>

          <div className="flex flex-wrap gap-2">
            <ActionButton icon={Search} label="Sanctions Check on Viktor Orlov" />
            <ActionButton icon={UserCheck} label="Request UBO Verification" />
            <ActionButton icon={FileSearch} label="Request Financial Statements" />
            <ActionButton icon={Building} label="Verify Company Registry" />
            <ActionButton icon={ExternalLink} label="Website Compliance Review" />
            <ActionButton icon={Ban} label="Reject Application" />
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="mt-6 space-y-2">
        {/* Progress bar */}
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            {isComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">Analysis complete</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                <span>AI generating insights...</span>
              </>
            )}
          </div>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export const useAISummaryBlock = ({ isDemoAccount }: { isDemoAccount: boolean }) => {
  return isDemoAccount
    ? createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'node',
          value: (
            <Card className="col-span-full overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 py-3 font-bold">
                <AITechIcon />
                <span className="bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                  AI Risk Assessment
                </span>
              </CardHeader>
              <CardContent className="bg-white p-6 transition-all duration-300 ease-in-out">
                <AISummaryContent />
              </CardContent>
            </Card>
          ),
        })
        .build()
    : null;
};
