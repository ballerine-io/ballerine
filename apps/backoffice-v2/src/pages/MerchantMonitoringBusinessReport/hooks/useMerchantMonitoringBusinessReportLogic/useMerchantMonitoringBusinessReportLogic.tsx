import { useNavigate, useParams } from 'react-router-dom';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { useCallback, useMemo } from 'react';
import { z } from 'zod';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { BusinessReportStatus } from '@/domains/business-reports/fetchers';
import { safeUrl } from '@/common/utils/safe-url/safe-url';
import { useReportTabs } from '@ballerine/ui';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });
  const { tabs } = useReportTabs({
    // Right now there is no `version` property on business reports.
    reportVersion: businessReport?.report?.version,
    report: {
      websiteCompanyAnalysis: {
        companyName: 'Aptoide S.A.',
        website: {
          url: 'https://shop.5688game.com/',
        },
        companyAnalysis: {
          indicators: [
            {
              name: 'Company Associated With Scam/Fraud',
              riskLevel: 'critical',
              sourceUrl: 'https://malwaretips.com/blogs/shoptallyho-com/',
            },
          ],
        },
        scamOrFraud: {
          summary:
            'No definitive evidence was found to classify Aptoide S.A. as a scam or involved in fraudulent activities.',
          indicators: [
            {
              violation:
                'A specific complaint from a credible source highlights that Jimdo has been associated with fraudulent practices, specifically using a third-party to pursue payments for subscriptions the customer claims to have never used.',
              sourceUrl: 'N/A',
            },
          ],
        },
        businessConsistency: {
          summary: '',
          indicators: [],
        },
      },
      lineOfBusiness: {
        website: {
          url: 'https://shop.5688game.com/',
        },
        riskIndicators: [
          {
            id: 'content-online-gaming',
            name: 'Online Gaming',
            riskLevel: 'moderate',
            triggerOn:
              'Alert this when the website is promoting or selling online gaming, in game tokens or other virtual game related products, especially if involving betting or gambling elements',
            description: '',
            minRiskScore: 60,
            baseRiskScore: 60,
            additionRiskScore: 2,
            maxRiskScoreForAddition: 98,
            explanation:
              'The website offers online gaming services, which may involve gambling elements and require regulatory compliance and age verification. The digital nature of goods may also present additional risks.',
            domain: 'content',
            riskTypeLevels: {
              transactionLaunderingRisk: 'positive',
              chargebackRisk: 'moderate',
              legalRisk: 'positive',
              reputationRisk: 'moderate',
            },
            recommendations: [],
          },
        ],
        lobDescription: 'Online Gaming Currency',
        formattedMcc: '5815 - Digital Goods: Media, Books, Movies, Not Music',
        mcc: '5815',
        mccProvided: null,
      },
      transactionLaundering: {
        website: {
          url: 'https://shop.5688game.com/',
        },
        riskIndicators: [
          {
            id: 'website-structure-missing-terms-and-conditions-(t&c)',
            reason: 'The website does not have a Terms And Conditions page',
            pageUrl: '',
            triggerOn:
              'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
            description: 'The website does not have a Terms And Conditions page',
            pageContext: 'Terms And Conditions',
            fullViolation: {
              id: 'website-structure-missing-terms-and-conditions-(t&c)',
              name: 'Missing Terms and Conditions (T&C)',
              domain: 'website structure',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              minRiskScore: 40,
              baseRiskScore: 40,
              riskTypeLevels: {
                legalRisk: 'moderate',
                chargebackRisk: 'moderate',
                reputationRisk: 'moderate',
                transactionLaunderingRisk: 'moderate',
              },
              recommendations: [],
              additionRiskScore: 1,
              maxRiskScoreForAddition: 98,
            },
            name: 'Missing Terms and Conditions (T&C)',
            riskLevel: 'moderate',
            baseRiskScore: 40,
            additionRiskScore: 1,
            minRiskScore: 40,
            maxRiskScoreForAddition: 98,
            domain: 'website structure',
            riskTypeLevels: {
              transactionLaunderingRisk: 'moderate',
              chargebackRisk: 'moderate',
              legalRisk: 'moderate',
              reputationRisk: 'moderate',
            },
            recommendations: [],
          },
          {
            id: 'website-structure-missing-privacy-policy',
            reason: 'The website does not have a Privacy Policy page',
            pageUrl: '',
            triggerOn:
              'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
            description: 'The website does not have a Privacy Policy page',
            pageContext: 'Privacy Policy',
            fullViolation: {
              id: 'website-structure-missing-privacy-policy',
              name: 'Missing Privacy Policy',
              domain: 'website structure',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              minRiskScore: 40,
              baseRiskScore: 40,
              riskTypeLevels: {
                legalRisk: 'moderate',
                chargebackRisk: 'moderate',
                reputationRisk: 'moderate',
                transactionLaunderingRisk: 'moderate',
              },
              recommendations: [],
              additionRiskScore: 1,
              maxRiskScoreForAddition: 98,
            },
            name: 'Missing Privacy Policy',
            riskLevel: 'moderate',
            baseRiskScore: 40,
            additionRiskScore: 1,
            minRiskScore: 40,
            maxRiskScoreForAddition: 98,
            domain: 'website structure',
            riskTypeLevels: {
              transactionLaunderingRisk: 'moderate',
              chargebackRisk: 'moderate',
              legalRisk: 'moderate',
              reputationRisk: 'moderate',
            },
            recommendations: [],
          },
          {
            id: 'website-structure-missing-about-us',
            reason: 'The website does not have an About Us page',
            pageUrl: '',
            triggerOn:
              'Alert this when the website does not have an about us page or offer general information surrounding the business',
            description: 'The website does not have an About Us page',
            pageContext: 'About Us',
            fullViolation: {
              id: 'website-structure-missing-about-us',
              name: 'Missing About Us',
              domain: 'website structure',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the website does not have an about us page or offer general information surrounding the business',
              minRiskScore: 40,
              baseRiskScore: 40,
              riskTypeLevels: {
                legalRisk: 'moderate',
                chargebackRisk: 'moderate',
                reputationRisk: 'moderate',
                transactionLaunderingRisk: 'moderate',
              },
              recommendations: [],
              additionRiskScore: 1,
              maxRiskScoreForAddition: 98,
            },
            name: 'Missing About Us',
            riskLevel: 'moderate',
            baseRiskScore: 40,
            additionRiskScore: 1,
            minRiskScore: 40,
            maxRiskScoreForAddition: 98,
            domain: 'website structure',
            riskTypeLevels: {
              transactionLaunderingRisk: 'moderate',
              chargebackRisk: 'moderate',
              legalRisk: 'moderate',
              reputationRisk: 'moderate',
            },
            recommendations: [],
          },
          {
            id: 'website-structure-missing-contact-us',
            reason: 'The website does not have a Contact Us page',
            pageUrl: '',
            triggerOn:
              'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
            description: 'The website does not have a Contact Us page',
            pageContext: 'Contact Us',
            fullViolation: {
              id: 'website-structure-missing-contact-us',
              name: 'Missing Contact Us',
              domain: 'website structure',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              minRiskScore: 40,
              baseRiskScore: 40,
              riskTypeLevels: {
                legalRisk: 'moderate',
                chargebackRisk: 'moderate',
                reputationRisk: 'moderate',
                transactionLaunderingRisk: 'moderate',
              },
              recommendations: [],
              additionRiskScore: 1,
              maxRiskScoreForAddition: 98,
            },
            name: 'Missing Contact Us',
            riskLevel: 'moderate',
            baseRiskScore: 40,
            additionRiskScore: 1,
            minRiskScore: 40,
            maxRiskScoreForAddition: 98,
            domain: 'website structure',
            riskTypeLevels: {
              transactionLaunderingRisk: 'moderate',
              chargebackRisk: 'moderate',
              legalRisk: 'moderate',
              reputationRisk: 'moderate',
            },
            recommendations: [],
          },
          {
            id: 'website-structure-missing-returns-policy',
            reason: 'The website does not have a Return Policy page',
            pageUrl: '',
            triggerOn:
              'Alert this when the website does not offer a Returns Policy or clear guidelines for returns and refunds, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
            description: 'The website does not have a Return Policy page',
            pageContext: 'Return Policy',
            fullViolation: {
              id: 'website-structure-missing-returns-policy',
              name: 'Missing Returns Policy',
              domain: 'website structure',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the website does not offer a Returns Policy or clear guidelines for returns and refunds, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              minRiskScore: 40,
              baseRiskScore: 40,
              riskTypeLevels: {
                legalRisk: 'moderate',
                chargebackRisk: 'moderate',
                reputationRisk: 'moderate',
                transactionLaunderingRisk: 'moderate',
              },
              recommendations: [],
              additionRiskScore: 1,
              maxRiskScoreForAddition: 98,
            },
            name: 'Missing Returns Policy',
            riskLevel: 'moderate',
            baseRiskScore: 40,
            additionRiskScore: 1,
            minRiskScore: 40,
            maxRiskScoreForAddition: 98,
            domain: 'website structure',
            riskTypeLevels: {
              transactionLaunderingRisk: 'moderate',
              chargebackRisk: 'moderate',
              legalRisk: 'moderate',
              reputationRisk: 'moderate',
            },
            recommendations: [],
          },
        ],
        businessConsitency: {
          summary: 'No inconsistency found',
          indicators: [],
        },
        scamOrFraud: {
          summary:
            'No definitive evidence was found to classify shop.5688game.com as a scam or involved in fraudulent activities.',
          indicators: [
            {
              violation:
                'The website nigoo.store is featured on a scam reporting website with a review questioning its legitimacy.',
              sourceUrl: 'https://www.scam-detector.com/validator/nigoo-store-review/',
            },
          ],
          blacklist: false,
        },
        pricingAnalysis: {
          summary:
            'After analyzing the provided product prices, there are no signs of transaction laundering, chargeback, legal, or reputation risks based on the pricing patterns. All prices seem to be within a reasonable range for virtual goods.',
          indicators: [
            'US$ 250.00 for a denim jacket is unusually high compared to standard market prices.',
          ],
        },
        websiteStructureEvaluation: {
          summary:
            "The website is missing several critical pages including 'Terms and Conditions', 'Privacy Policy', 'About Us', 'Contact Us', and 'Return Policy', which are essential for legal compliance, customer trust, and satisfaction.",
          indicators: [
            'The website does not have a Terms And Conditions page',
            'The website does not have a Privacy Policy page',
            'The website does not have an About Us page',
            'The website does not have a Contact Us page',
            'The website does not have a Return Policy page',
          ],
        },
        trafficAnalysis: {
          trafficSources: ['search - 62.30%', 'direct - 32.36%'],
          engagements: [
            'Time on site - 574.83 seconds',
            'Page per visit - 7.00',
            'Bounce rate - 34.85%',
          ],
          montlyVisitsIndicators: [
            'December 2023 - 28142',
            'January 2024 - 46968',
            'February 2024 - 34341',
            'March 2024 - 54031',
            'April 2024 - 59713',
            'May 2024 - 48325',
          ],
        },
        reputation: null,
        transactionAnalysis: null,
      },
      ecosystem: {
        website: {
          url: 'https://shop.5688game.com/',
        },
        domains: [
          {
            domain: 'merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com',
            relatedNode: 'related node',
            relatedNodeType: 'email',
          },
        ],
      },
      socialMedia: {
        facebookData: {
          id: 'null',
          pageUrl:
            'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          pageName: 'null',
          name: 'null',
          email: 'a@a.com',
          address: 'null',
          phoneNumber: 'null',
          creationDate: 'null',
          numberOfLikes: 2,
          screenshotUrl:
            'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          pageCategories: 'null',
          likesCount: 1,
          facebookAdsLink:
            'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          facebookAboutUsLink:
            'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
        },
        pickedAds: [
          {
            link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            screenshotUrl:
              'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          },
          {
            link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            screenshotUrl:
              'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          },
        ],
        instagramData: {
          id: 'null',
          pageUrl:
            'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          pageName: 'null',
          username: 'null',
          isVerified: true,
          biography: 'null',
          postsCount: 3,
          followsCount: 2,
          screenshotUrl:
            'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
          isBusinessAccount: true,
          numberOfFollowers: 1,
          pageCategories: 'null',
        },
        website: {
          url: 'https://shop.5688game.com/',
        },
        socialRawData: {},
        riskIndicators: [
          {
            id: 'social-partial-social-media-presence',
            name: 'Partial Social Media Presence',
            domain: 'social',
            riskLevel: 'moderate',
            triggerOn:
              'Alert this when the business has a social media presence, but there is only facebook page and not Instagram page, or the opposite',
            minRiskScore: 10,
            baseRiskScore: 30,
            riskTypeLevels: {
              transactionLaunderingRisk: 'positive',
              chargebackRisk: 'positive',
              legalRisk: 'positive',
              reputationRisk: 'positive',
            },
            recommendations: [],
            additionRiskScore: 1,
            maxRiskScoreForAddition: 98,
          },
        ],
        ads: {
          facebook: {
            adsInformation: {
              id: 'null',
              link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              name: 'null',
              email: 'a@a.com',
              address: 'null',
              pageName: 'null',
              pickedAd: {
                link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
                screenshotUrl:
                  'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              },
              pickedAd2: {
                link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
                screenshotUrl:
                  'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              },
              likesCount: 1,
              phoneNumber: 'null',
              creationDate: 'null',
              numberOfLikes: 2,
              screenshotUrl:
                'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              pageCategories: 'null',
              facebookAdsLink:
                'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              facebookAboutUsLink:
                'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            },
            link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            imageUrl:
              'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            pickedAd: {
              link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              imageUrl:
                'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            },
          },
          instagram: {
            adsInformation: {
              id: 'null',
              link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              name: 'null',
              fullName: 'null',
              verified: true,
              biography: 'null',
              postsCount: 3,
              followsCount: 2,
              screenshotUrl:
                'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
              isBusinessAccount: true,
              numberOfFollowers: 1,
              businessCategoryName: 'null',
            },
            link: 'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            imageUrl:
              'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/0d098ced-a4ee-4f7a-89f1-36d0857e83dd.jpeg',
            pickedAd: {
              link: null,
              imageUrl: null,
            },
          },
        },
        relatedAds: {
          summary:
            'No advertisements related to the website https://shop.5688game.com/ were provided for analysis. Therefore, no content summary can be given, and no potential risks can be identified from the social media presence.',
          violations: [],
        },
      },
      homepageScreenshot:
        'https://merchant-analysis-ballerine-test-dev.s3.eu-central-1.amazonaws.com/screenshot/3e3fafe3-34f5-4d70-90a9-410012c20c95.jpeg',
      summary: {
        website: {
          url: 'https://shop.5688game.com/',
        },
        summary:
          "The website https://shop.5688game.com/ has been assigned a risk score of 44, indicating moderate risk. This score is primarily due to significant website structure violations, including the absence of critical pages such as 'Terms and Conditions', 'Privacy Policy', 'About Us', 'Contact Us', and 'Return Policy'. These omissions raise concerns regarding legal compliance, customer trust, and satisfaction, which are crucial for any online business, especially one dealing with online gaming currency as indicated by the line of business analysis. Despite these concerns, there were no violations found in the company name analysis, social analysis, ads analysis, or ecosystem analysis. The lack of essential website pages significantly contributes to the website's overall risk profile, suggesting a need for improvement in these areas to mitigate potential risks.",
        riskScore: 86,
        riskIndicatorsByDomain: {
          tldViolations: [
            {
              id: 'website-structure-missing-terms-and-conditions-(t&c)',
              reason: 'The website does not have a Terms And Conditions page',
              pageUrl: '',
              triggerOn:
                'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              description: 'The website does not have a Terms And Conditions page',
              pageContext: 'Terms And Conditions',
              fullViolation: {
                id: 'website-structure-missing-terms-and-conditions-(t&c)',
                name: 'Missing Terms and Conditions (T&C)',
                domain: 'website structure',
                riskLevel: 'moderate',
                triggerOn:
                  'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                minRiskScore: 40,
                baseRiskScore: 40,
                riskTypeLevels: {
                  legalRisk: 'moderate',
                  chargebackRisk: 'moderate',
                  reputationRisk: 'moderate',
                  transactionLaunderingRisk: 'moderate',
                },
                recommendations: [],
                additionRiskScore: 1,
                maxRiskScoreForAddition: 98,
              },
              name: 'Missing Terms and Conditions (T&C)',
              riskLevel: 'moderate',
              baseRiskScore: 40,
              additionRiskScore: 1,
              minRiskScore: 40,
              maxRiskScoreForAddition: 98,
              domain: 'website structure',
              riskTypeLevels: {
                transactionLaunderingRisk: 'moderate',
                chargebackRisk: 'moderate',
                legalRisk: 'moderate',
                reputationRisk: 'moderate',
              },
              recommendations: [],
            },
            {
              id: 'website-structure-missing-privacy-policy',
              reason: 'The website does not have a Privacy Policy page',
              pageUrl: '',
              triggerOn:
                'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              description: 'The website does not have a Privacy Policy page',
              pageContext: 'Privacy Policy',
              fullViolation: {
                id: 'website-structure-missing-privacy-policy',
                name: 'Missing Privacy Policy',
                domain: 'website structure',
                riskLevel: 'moderate',
                triggerOn:
                  'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                minRiskScore: 40,
                baseRiskScore: 40,
                riskTypeLevels: {
                  legalRisk: 'moderate',
                  chargebackRisk: 'moderate',
                  reputationRisk: 'moderate',
                  transactionLaunderingRisk: 'moderate',
                },
                recommendations: [],
                additionRiskScore: 1,
                maxRiskScoreForAddition: 98,
              },
              name: 'Missing Privacy Policy',
              riskLevel: 'moderate',
              baseRiskScore: 40,
              additionRiskScore: 1,
              minRiskScore: 40,
              maxRiskScoreForAddition: 98,
              domain: 'website structure',
              riskTypeLevels: {
                transactionLaunderingRisk: 'moderate',
                chargebackRisk: 'moderate',
                legalRisk: 'moderate',
                reputationRisk: 'moderate',
              },
              recommendations: [],
            },
            {
              id: 'website-structure-missing-about-us',
              reason: 'The website does not have an About Us page',
              pageUrl: '',
              triggerOn:
                'Alert this when the website does not have an about us page or offer general information surrounding the business',
              description: 'The website does not have an About Us page',
              pageContext: 'About Us',
              fullViolation: {
                id: 'website-structure-missing-about-us',
                name: 'Missing About Us',
                domain: 'website structure',
                riskLevel: 'moderate',
                triggerOn:
                  'Alert this when the website does not have an about us page or offer general information surrounding the business',
                minRiskScore: 40,
                baseRiskScore: 40,
                riskTypeLevels: {
                  legalRisk: 'moderate',
                  chargebackRisk: 'moderate',
                  reputationRisk: 'moderate',
                  transactionLaunderingRisk: 'moderate',
                },
                recommendations: [],
                additionRiskScore: 1,
                maxRiskScoreForAddition: 98,
              },
              name: 'Missing About Us',
              riskLevel: 'moderate',
              baseRiskScore: 40,
              additionRiskScore: 1,
              minRiskScore: 40,
              maxRiskScoreForAddition: 98,
              domain: 'website structure',
              riskTypeLevels: {
                transactionLaunderingRisk: 'moderate',
                chargebackRisk: 'moderate',
                legalRisk: 'moderate',
                reputationRisk: 'moderate',
              },
              recommendations: [],
            },
            {
              id: 'website-structure-missing-contact-us',
              reason: 'The website does not have a Contact Us page',
              pageUrl: '',
              triggerOn:
                'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              description: 'The website does not have a Contact Us page',
              pageContext: 'Contact Us',
              fullViolation: {
                id: 'website-structure-missing-contact-us',
                name: 'Missing Contact Us',
                domain: 'website structure',
                riskLevel: 'moderate',
                triggerOn:
                  'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                minRiskScore: 40,
                baseRiskScore: 40,
                riskTypeLevels: {
                  legalRisk: 'moderate',
                  chargebackRisk: 'moderate',
                  reputationRisk: 'moderate',
                  transactionLaunderingRisk: 'moderate',
                },
                recommendations: [],
                additionRiskScore: 1,
                maxRiskScoreForAddition: 98,
              },
              name: 'Missing Contact Us',
              riskLevel: 'moderate',
              baseRiskScore: 40,
              additionRiskScore: 1,
              minRiskScore: 40,
              maxRiskScoreForAddition: 98,
              domain: 'website structure',
              riskTypeLevels: {
                transactionLaunderingRisk: 'moderate',
                chargebackRisk: 'moderate',
                legalRisk: 'moderate',
                reputationRisk: 'moderate',
              },
              recommendations: [],
            },
            {
              id: 'website-structure-missing-returns-policy',
              reason: 'The website does not have a Return Policy page',
              pageUrl: '',
              triggerOn:
                'Alert this when the website does not offer a Returns Policy or clear guidelines for returns and refunds, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
              description: 'The website does not have a Return Policy page',
              pageContext: 'Return Policy',
              fullViolation: {
                id: 'website-structure-missing-returns-policy',
                name: 'Missing Returns Policy',
                domain: 'website structure',
                riskLevel: 'moderate',
                triggerOn:
                  'Alert this when the website does not offer a Returns Policy or clear guidelines for returns and refunds, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                minRiskScore: 40,
                baseRiskScore: 40,
                riskTypeLevels: {
                  legalRisk: 'moderate',
                  chargebackRisk: 'moderate',
                  reputationRisk: 'moderate',
                  transactionLaunderingRisk: 'moderate',
                },
                recommendations: [],
                additionRiskScore: 1,
                maxRiskScoreForAddition: 98,
              },
              name: 'Missing Returns Policy',
              riskLevel: 'moderate',
              baseRiskScore: 40,
              additionRiskScore: 1,
              minRiskScore: 40,
              maxRiskScoreForAddition: 98,
              domain: 'website structure',
              riskTypeLevels: {
                transactionLaunderingRisk: 'moderate',
                chargebackRisk: 'moderate',
                legalRisk: 'moderate',
                reputationRisk: 'moderate',
              },
              recommendations: [],
            },
          ],
          ecosystemViolations: [],
          companyNameViolations: [
            {
              id: 'company-analysis-company-associated-with-scam/fraud',
              name: 'Company Associated With Scam/Fraud',
              domain: 'company analysis',
              riskLevel: 'critical',
              sourceUrl: 'https://malwaretips.com/blogs/shoptallyho-com/',
              triggerOn: 'Alert this when of of the sources: ',
              description:
                'Shoptallyho is explicitly mentioned in a scam advice context, indicating potential fraudulent activity, as acknowledged by reputable scam awareness sites.',
              minRiskScore: 60,
              baseRiskScore: 78,
              riskTypeLevels: {
                transactionLaunderingRisk: 'critical',
                chargebackRisk: 'critical',
                legalRisk: 'critical',
                reputationRisk: 'critical',
              },
              recommendations: [],
              additionRiskScore: 3,
              maxRiskScoreForAddition: 98,
            },
          ],
          lineOfBusinessViolations: [
            {
              id: 'content-online-gaming',
              name: 'Online Gaming',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the website is promoting or selling online gaming, in game tokens or other virtual game related products, especially if involving betting or gambling elements',
              description: '',
              minRiskScore: 60,
              baseRiskScore: 60,
              additionRiskScore: 2,
              maxRiskScoreForAddition: 98,
              explanation:
                'The website offers online gaming services, which may involve gambling elements and require regulatory compliance and age verification. The digital nature of goods may also present additional risks.',
              domain: 'content',
              riskTypeLevels: {
                transactionLaunderingRisk: 'positive',
                chargebackRisk: 'moderate',
                legalRisk: 'positive',
                reputationRisk: 'moderate',
              },
              recommendations: [],
            },
          ],
          adsAndSocialViolations: [
            {
              id: 'social-partial-social-media-presence',
              name: 'Partial Social Media Presence',
              domain: 'social',
              riskLevel: 'moderate',
              triggerOn:
                'Alert this when the business has a social media presence, but there is only facebook page and not Instagram page, or the opposite',
              minRiskScore: 10,
              baseRiskScore: 30,
              riskTypeLevels: {
                transactionLaunderingRisk: 'positive',
                chargebackRisk: 'positive',
                legalRisk: 'positive',
                reputationRisk: 'positive',
              },
              recommendations: [],
              additionRiskScore: 1,
              maxRiskScoreForAddition: 98,
            },
          ],
        },
        creationDate: 1723047665956,
        riskLevels: {
          legalRisk: 'critical',
          chargebackRisk: 'critical',
          reputationRisk: 'critical',
          transactionLaunderingRisk: 'critical',
        },
        recommendations: [],
      },
    },
    companyName: businessReport?.companyName,
    Link: RiskIndicatorLink,
  });
  const tabsValues = useMemo(() => tabs.map(tab => tab.value), [tabs]);
  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });
  const [{ activeTab }] = useZodSearchParams(MerchantMonitoringBusinessReportSearchSchema);
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'merchant-monitoring:business-report:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('merchant-monitoring:business-report:previous-path');
  }, [navigate]);
  const statusToBadgeData = {
    [BusinessReportStatus.COMPLETED]: { variant: 'info', text: 'Manual Review' },
    [BusinessReportStatus.IN_PROGRESS]: { variant: 'violet', text: 'In-progress' },
    [BusinessReportStatus.NEW]: { variant: 'secondary', text: 'New' },
  } as const;

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    activeTab,
  };
};
