import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@ballerine/ui';
import {
  Brain,
  FileSearch,
  UserCheck,
  Building,
  ExternalLink,
  Ban,
  Sparkles,
  Info,
  MessagesSquare,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

// Enhanced AI icon with subtle animation effect
const AITechIcon = () => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    // Simple pulse animation
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 20);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const pulseIntensity = Math.sin(animationFrame * 0.3) * 0.15 + 0.85;

  return (
    <div className="relative h-9 w-9">
      {/* Animated glow effect */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/60 to-indigo-600/60 blur-sm"
        style={{ transform: `scale(${pulseIntensity})`, transition: 'transform 0.2s ease-in-out' }}
      />
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-700">
        <Brain className="h-5 w-5 text-white" />
      </div>
      {/* Neural network nodes effect */}
      <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-blue-400/80" />
      <div className="absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-full bg-indigo-300/80" />
    </div>
  );
};

// Technical model information
interface AIModelInfo {
  name: string;
  version: string;
  dataPoints: number;
  confidenceScore: number;
  lastUpdated: string;
}

const defaultModelInfo: AIModelInfo = {
  name: 'RiskDetect™',
  version: '4.2.1',
  dataPoints: 1673940,
  confidenceScore: 96.7,
  lastUpdated: '2 hours ago',
};

// Enhanced Ask AI Component connected to actions
const AskAIPanel = ({
  actions = [],
}: {
  actions?: Array<{ icon: React.ElementType; label: string; onClick?: () => void }>;
}) => {
  const [showPremiumTooltip, setShowPremiumTooltip] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const askButtonRef = React.useRef<HTMLButtonElement>(null);

  // Handle the Ask AI button click
  const handleAskAI = () => {
    if (inputValue.trim() || activeQuestion) {
      setIsLoading(true);

      // Show loading for 2 seconds before showing premium tooltip
      setTimeout(() => {
        setIsLoading(false);
        setShowPremiumTooltip(true);
      }, 2000);
    }
  };

  // When a premade question is clicked, set it as the input value
  const handleQuestionClick = (question: string) => {
    setActiveQuestion(question);
    setInputValue(question);
  };

  return (
    <div className="relative rounded-xl border-2 border-indigo-200/50 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="absolute -top-3 left-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-0.5 text-xs font-medium text-white shadow-sm">
        AI ASSISTANT
      </div>

      <div className="flex gap-3">
        <div className="relative flex flex-1 items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MessagesSquare className="h-4 w-4 text-indigo-500" />
          </div>
          <input
            type="text"
            placeholder="Ask the AI about this case or next actions to take..."
            className="block w-full rounded-xl border-gray-200 bg-white/90 py-2 pl-10 pr-12 text-sm text-gray-700 shadow-sm backdrop-blur-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 focus:ring-opacity-50"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {activeQuestion ? (
              <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-indigo-500"></div>
            ) : (
              <MessagesSquare className="h-3.5 w-3.5 text-gray-400" />
            )}
          </div>
        </div>

        <button
          ref={askButtonRef}
          className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
            isLoading
              ? 'cursor-not-allowed bg-indigo-500 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 hover:shadow-md'
          }`}
          onClick={handleAskAI}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="relative mr-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
              </span>
              Processing...
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <div className="absolute -bottom-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-purple-300" />
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {['Why is this high risk?', 'What actions should I take?', 'Find similar cases'].map(
          question => (
            <button
              key={question}
              className={`rounded-full border ${
                inputValue === question
                  ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-violet-50 shadow-sm'
                  : 'border-indigo-200 bg-white/80 backdrop-blur-sm'
              } px-3 py-1 text-xs text-indigo-700 transition-colors hover:bg-indigo-50`}
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </button>
          ),
        )}
      </div>

      {/* Actions suggested by AI - integration with actions */}
      <div className="mt-4 border-t border-indigo-100 pt-3">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text font-medium text-transparent">
            AI Recommended Actions
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {showMoreActions
            ? actions.map((action, index) => (
                <ActionButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  onClick={action.onClick}
                />
              ))
            : actions
                .slice(0, 3)
                .map((action, index) => (
                  <ActionButton
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={action.onClick}
                  />
                ))}
          {actions.length > 3 && !showMoreActions && (
            <button
              className="flex items-center gap-1 rounded-md border border-gray-200 bg-white/80 px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-50"
              onClick={() => setShowMoreActions(true)}
            >
              <span>+{actions.length - 3} more</span>
            </button>
          )}
          {showMoreActions && (
            <button
              className="flex items-center gap-1 rounded-md border border-gray-200 bg-white/80 px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-50"
              onClick={() => setShowMoreActions(false)}
            >
              <span>Show less</span>
            </button>
          )}
        </div>
      </div>

      {showPremiumTooltip && (
        <div className="absolute right-0 top-16 z-50">
          <div className="w-72 rounded-xl border border-indigo-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <div className="rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 p-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Premium Feature</p>
                  <p className="mt-1 text-gray-600">
                    Advanced AI Assistant capabilities require a premium subscription.
                  </p>
                </div>
              </div>
              <button
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setShowPremiumTooltip(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <p className="mb-2 text-gray-600">With Premium AI, you can:</p>
              <ul className="ml-4 list-disc space-y-1 text-gray-600">
                <li>Get instant case analysis and risk assessments</li>
                <li>Receive tailored action recommendations</li>
                <li>Access advanced document verification</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Also enhance the ActionButton to match the Apple Intelligence aesthetic
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
        className="flex items-center gap-2 rounded-xl border border-indigo-200/70 bg-white/80 px-3 py-1.5 text-sm text-indigo-700 transition-all hover:bg-indigo-50/80 hover:shadow-sm"
        onClick={onClick}
        onMouseEnter={() => setShowPremiumTooltip(true)}
        onMouseLeave={() => setShowPremiumTooltip(false)}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </button>

      {showPremiumTooltip && (
        <div className="absolute bottom-full left-0 z-50 mb-1 w-56 rounded-xl border border-indigo-200 bg-white/95 p-2 text-xs shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-indigo-700">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
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
  confidence?: number; // Added confidence score for each finding
  source?: {
    label?: string;
    tooltip: string;
    dataPoints?: number; // Number of data points analyzed
  };
}

interface ParagraphSection {
  type: 'paragraph' | 'heading';
  content: string;
}

interface BulletSection {
  type: 'bullets';
  content: Finding[];
}

type Section = ParagraphSection | BulletSection;

interface SummaryCardData {
  companyName: string;
  riskScore: number;
  analysisDate: string; // When the analysis was performed
  businessInfo: {
    claimedType: string;
    actualType: string;
    chargebackRatio: string;
    uboStatus: string;
  };
}

interface AISummaryContentProps {
  sections?: Section[];
  summaryData?: SummaryCardData;
  actions?: Array<{
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }>;
  modelInfo?: AIModelInfo;
}

// Component for showing a high-tech "neural connection" visualization
const NeuralConnectionDot = () => {
  return (
    <div className="relative h-1 w-1">
      <div className="absolute h-1 w-1 animate-ping rounded-full bg-indigo-400" />
      <div className="absolute h-1 w-1 rounded-full bg-indigo-500" />
    </div>
  );
};

// Enhanced finding component with confidence indicators
const FindingWithSource = ({ finding }: { finding: Finding }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!finding.source) {
    return <span>{finding.text}</span>;
  }

  return (
    <span className="group">
      <span>{finding.text}</span>{' '}
      <span
        className="relative inline-flex cursor-help items-center text-xs text-indigo-600"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="font-medium">· Source</span>
        <Info className="ml-0.5 h-3 w-3 text-indigo-500" />

        {showTooltip && (
          <div className="absolute -right-2 top-0 z-50 mt-6 w-80 rounded-md border border-indigo-100 bg-white p-3 text-xs shadow-lg">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-indigo-100 p-1.5">
                  <Brain className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-indigo-700">AI Analysis</p>
                  </div>
                  <p className="mt-1.5 text-gray-700">{finding.source.tooltip}</p>
                </div>
              </div>

              <p className="mt-1 border-t border-gray-100 pt-1.5 text-[10px] italic text-gray-500">
                Analysis performed by RiskDetect™ AI using advanced machine learning algorithms and
                natural language processing.
              </p>
            </div>
          </div>
        )}
      </span>
    </span>
  );
};

const defaultSections: Section[] = [
  {
    type: 'paragraph',
    content:
      'Based on comprehensive analysis of GreenTech Solutions Ltd, this entity presents critical risk factors requiring immediate attention:',
  },
  { type: 'heading', content: '1) Risk Assessment' },
  {
    type: 'bullets',
    content: [
      {
        text: 'Severe business activity mismatch: The business is declared as operating in the business of eco-friendly office supplies but web presence indicates the operation of a crypto trading platform',
        confidence: 99.2,
        source: {
          tooltip:
            'Onsite text mentions "crypto-trading", "copy-trading features" and other elements likely to be associated with a crypto-trading platform.',
          dataPoints: 7834,
        },
      },
      {
        text: 'Significant discrepancies between declared business activities and actual operations',
        confidence: 97.8,
        source: {
          tooltip:
            'MCC classification does not match declared business activity. Website and social media content are inconsistent with the claimed business model.',
          dataPoints: 12405,
        },
      },
    ],
  },
  { type: 'heading', content: '2) Key Compliance Concerns:' },
  {
    type: 'bullets',
    content: [
      {
        text: 'Concealed UBO Carlton Ellington Cushnie (40%) identified through OSINT investigation',
        confidence: 96.7,
        source: {
          tooltip: 'Undeclared UBO was found in registry check.',
          dataPoints: 8412,
        },
      },
      {
        text: 'UBO linked to high-risk jurisdiction',
        confidence: 94.3,
        source: {
          tooltip:
            'OSINT reveals connections between the UBO Carlton Ellington Cushnie and a high-risk jurisdiction (Cayman Islands).',
          dataPoints: 15692,
        },
      },
      {
        text: 'Operates without required business licensing for actual services',
        confidence: 98.1,
        source: {
          tooltip:
            'No evidence of a valid license for the operation of a crypto-trading platform was found to be associated with the entity.',
          dataPoints: 4231,
        },
      },
    ],
  },
  { type: 'heading', content: 'Customer & Operational Issues:' },
  {
    type: 'bullets',
    content: [
      {
        text: 'Multiple customer complaints about inability to withdraw funds',
        confidence: 97.9,
        source: {
          tooltip: '23 complaints were recovered relating to withdrawal of funds from account.',
          dataPoints: 9871,
        },
      },
      {
        text: 'Consistent refusal to process customer refunds',
        confidence: 96.5,
        source: {
          tooltip:
            'Analysis of online reviews reveals pattern of refund denial and customer service avoidance.',
          dataPoints: 14387,
        },
      },
    ],
  },
  { type: 'heading', content: '4) Recommended Actions:' },
  {
    type: 'bullets',
    content: [
      {
        text: 'Reject merchant application due to deceptive business practices',
        confidence: 99.8,
        source: {
          tooltip:
            'Clear evidence of misrepresentation of business activities and potential illicit operations.',
          dataPoints: 21543,
        },
      },
      {
        text: 'Flag UBO in monitoring systems for enhanced due diligence in future applications',
        confidence: 98.9,
        source: {
          tooltip:
            'Add associated UBO information to internal watchlists to prevent potential future merchant onboarding through different entities.',
          dataPoints: 7698,
        },
      },
      {
        text: 'Add to internal high-risk merchant database to prevent re-application',
        confidence: 99.1,
        source: {
          tooltip:
            'Permanent flagging in merchant screening system recommended based on severity of findings.',
          dataPoints: 9432,
        },
      },
    ],
  },
];

const defaultSummaryData: SummaryCardData = {
  companyName: 'GreenTech Solutions Ltd',
  riskScore: 98,
  analysisDate: 'October 12, 2023 • 14:37 UTC',
  businessInfo: {
    claimedType: 'Claimed: Eco-friendly Retail',
    actualType: 'Massage Parlor (Suspicious)',
    chargebackRatio: '8.3% (High)',
    uboStatus: 'Failed - Hidden UBO',
  },
};

const defaultActions = [
  { icon: FileSearch, label: 'Background Check on Carlton Cushnie' },
  { icon: UserCheck, label: 'Verify Business Operations' },
  { icon: FileSearch, label: 'Request Licensing Documentation' },
  { icon: Building, label: 'On-Site Verification' },
  { icon: ExternalLink, label: 'Report to Authorities' },
  { icon: Ban, label: 'Reject Application' },
];

// New component: Simple version of the AI Summary Content
const SimpleAISummaryContent = ({
  sections = defaultSections,
}: Omit<AISummaryContentProps, 'modelInfo'>) => {
  // Get yesterday's date with fixed time
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(null);

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {sections.map((section, sectionIndex) => {
          if (section.type === 'paragraph' || section.type === 'heading') {
            return (
              <div key={sectionIndex}>
                {section.type === 'heading' ? (
                  <strong className="text-gray-800">{section.content}</strong>
                ) : (
                  <p className="text-gray-700">{section.content}</p>
                )}
              </div>
            );
          }

          if (section.type === 'bullets') {
            return (
              <div key={sectionIndex} className="py-1">
                <ul className="list-disc space-y-2 pl-6">
                  {section.content.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="text-gray-700">
                      <FindingWithSource finding={bullet} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-xs">
        <div className="text-gray-500">Was this case analysis helpful?</div>
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-1 ${
              feedbackGiven === 'like' ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
            } transition-colors`}
            onClick={() => setFeedbackGiven('like')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{feedbackGiven === 'like' ? 'Thank you!' : 'Yes'}</span>
          </button>
          <button
            className={`flex items-center gap-1 ${
              feedbackGiven === 'dislike' ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            } transition-colors`}
            onClick={() => setFeedbackGiven('dislike')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{feedbackGiven === 'dislike' ? 'Feedback recorded' : 'No'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AISummaryContent = ({
  sections = defaultSections,
  summaryData = defaultSummaryData,
  actions = defaultActions,
}: AISummaryContentProps) => {
  // Get yesterday's date with fixed time
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const analysisDate =
    yesterday.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }) + ' • 14:37 UTC';

  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(null);

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
        {sections.map((section, sectionIndex) => {
          if (section.type === 'paragraph' || section.type === 'heading') {
            return (
              <div key={sectionIndex}>
                {section.type === 'heading' ? (
                  <strong className="text-gray-800">{section.content}</strong>
                ) : (
                  <p className="text-gray-700">{section.content}</p>
                )}
              </div>
            );
          }

          if (section.type === 'bullets') {
            return (
              <div key={sectionIndex} className="py-1">
                <ul className="list-disc space-y-2 pl-6">
                  {section.content.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="text-gray-700">
                      <FindingWithSource finding={bullet} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* AI Assistant with actions */}
      <AskAIPanel actions={actions} />

      <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 text-xs">
        <div className="text-gray-500">Was this AI risk assessment helpful?</div>
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-1 ${
              feedbackGiven === 'like' ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
            } transition-colors`}
            onClick={() => setFeedbackGiven('like')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{feedbackGiven === 'like' ? 'Thank you!' : 'Yes'}</span>
          </button>
          <button
            className={`flex items-center gap-1 ${
              feedbackGiven === 'dislike' ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            } transition-colors`}
            onClick={() => setFeedbackGiven('dislike')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{feedbackGiven === 'dislike' ? 'Feedback recorded' : 'No'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const useAISummaryBlock = ({
  isDemoAccount,
  sections,
  summaryData,
  actions,
  modelInfo = defaultModelInfo,
  useAdvancedAI = true, // Feature flag to toggle between simple/advanced versions
}: {
  isDemoAccount: boolean;
  sections?: Section[];
  summaryData?: SummaryCardData;
  actions?: Array<{
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }>;
  modelInfo?: AIModelInfo;
  useAdvancedAI?: boolean; // Feature flag parameter
}) => {
  if (!isDemoAccount) {
    return [];
  }

  return createBlocksTyped()
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
          <CardContent className="bg-white p-6">
            {useAdvancedAI ? (
              <AISummaryContent
                sections={sections}
                summaryData={summaryData}
                actions={actions}
                modelInfo={modelInfo}
              />
            ) : (
              <SimpleAISummaryContent
                sections={sections}
                summaryData={summaryData}
                actions={actions}
              />
            )}
          </CardContent>
        </Card>
      ),
    })
    .build();
};
