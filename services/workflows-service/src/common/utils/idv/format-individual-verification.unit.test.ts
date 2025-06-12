import { formatIndividualVerification } from '.';

describe('formatIndividualVerification #unit', () => {
  describe("when an individual verification's payload is provided", () => {
    it('should return the expected format of data', () => {
      // Arrange
      const decision = 'approved';
      const decisionScore = 0.99;
      const reason = 'Suspected document tampering';
      const person = {
        gender: {
          value: null,
          sources: [],
          confidenceCategory: null,
        },
        address: {
          value: null,
          sources: [],
          components: {},
          confidenceCategory: null,
        },
        idNumber: {
          value: '312578946',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        lastName: {
          value: 'SMITH',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        firstName: {
          value: 'JOHN',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        extraNames: null,
        dateOfBirth: {
          value: '1985-07-23',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        nationality: {
          value: null,
          sources: [],
          confidenceCategory: null,
        },
        placeOfBirth: null,
        foreignerStatus: null,
      };
      const insights = {
        fraud: {
          allowedIpLocation: 'yes',
          expectedTrafficBehaviour: 'yes',
          newUser: 'no',
        },
        document: {
          documentAccepted: 'yes',
          documentNotExpired: 'yes',
          documentRecognised: 'yes',
          physicalDocumentPresent: 'yes',
          validDocumentAppearance: 'yes',
          documentBackFullyVisible: 'yes',
          documentFrontFullyVisible: 'yes',
          documentBackImageAvailable: 'yes',
          documentFrontImageAvailable: 'yes',
          documentImageQualitySufficient: 'yes',
          newDocument: 'no',
        },
        biometric: {
          faceLiveness: 'yes',
          faceImageAvailable: 'yes',
          faceNotInBlocklist: 'yes',
          faceSimilarToPortrait: 'yes',
          faceImageQualitySufficient: 'yes',
        },
      };
      const aml = {
        hits: [
          {
            pep: [],
            other: [],
            warnings: [],
            countries: ['Eritrea', 'Israel', 'United States'],
            sanctions: [],
            matchTypes: ['name_exact', 'year_of_birth'],
            matchedName: 'John Smith',
            adverseMedia: [
              {
                date: null,
                type: null,
                sourceUrl: null,
                sourceName: 'ComplyAdvantage Adverse Media',
              },
              {
                date: '2015-10-19T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.csmonitor.com/layout/set/amphtml/World/Security-Watch/terrorism-security/2015/1019/As-tensions-spike-in-Israel-asylum-seeker-mistaken-for-attacker-is-killed',
                sourceName:
                  'As tensions spike in Israel, asylum-seeker mistaken for attacker is killed - CSMonitor.com',
              },
              {
                date: '2015-10-25T00:00:00Z',
                type: null,
                sourceUrl:
                  'http://www.timesofisrael.com/beersheba-bus-station-shooter-was-in-touch-with-hamas-police-charge/',
                sourceName:
                  'Beersheba bus station shooter was in touch with Hamas, police charge | The Times of Israel',
              },
              {
                date: null,
                type: null,
                sourceUrl: 'http://www.dehai.org/archives/dehai_news_archive/2015/oct/0359.html',
                sourceName:
                  "Dehai News Mailing List Archive: (Ynet News)Soldier murdered in Be'er Sheva bus terminal shooting, Eritrean lynched",
              },
              {
                date: '2020-09-25T00:00:00Z',
                type: null,
                sourceUrl:
                  'http://www.jpost.com/Arab-Israeli-Conflict/Eritrean-man-mistaken-for-terror-accomplice-dies-after-being-shot-attacked-by-mob-426369',
                sourceName:
                  'Eritrean man mistaken for terror accomplice dies after being shot, attacked by mob - Arab-Israeli Conflict - Jerusalem Post',
              },
              {
                date: '2015-10-19T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.jpost.com/Arab-Israeli-Conflict/Eritrean-man-mistaken-for-terror-accomplice-dies-after-being-shot-attacked-by-mob-426369',
                sourceName:
                  'Eritrean man mistaken for terror accomplice dies after being shot, attacked by mob - The Jerusalem Post',
              },
              {
                date: null,
                type: null,
                sourceUrl: 'http://www.israelnationalnews.com/News/News.aspx/202107',
                sourceName: 'Funeral for Sgt. John Smith at 4 PM - Defense/Security - News -',
              },
              {
                date: '2015-11-04T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.haaretz.com/israel-news/2015-11-05/ty-article/.premium/mk-bedouin-slain-after-attack-was-innocent/0000017f-f0e3-dc28-a17f-fcf729140000',
                sourceName:
                  "Israeli Arab Lawmaker: Bedouin Slain After Be'er Sheva Terror Attack Was Innocent - Israel News - Haaretz.com",
              },
              {
                date: '2018-04-24T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.haaretz.com/whdcMobileSite/israel-news/judge-proposes-lighter-charges-for-lynchers-of-asylum-seeker-1.5481735',
                sourceName:
                  'Israeli judge proposes lighter charges in case of asylum seeker mistakenly killed during terror attack - Israel News -   Haaretz.com',
              },
              {
                date: '2015-10-22T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.jpost.com/Israel-News/Prison-service-employees-appear-in-court-for-beating-of-Eritrean-mistaken-for-terrorist-429733',
                sourceName:
                  'Police arrest four suspects in mistaken killing of Eritrean man - Israel News - The Jerusalem Post',
              },
              {
                date: '2015-10-25T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.haaretz.com/israel-news/.premium-police-beer-sheva-terrorist-was-in-contact-with-hamas-1.5413133',
                sourceName:
                  "Police: Be'er Sheva terrorist was in contact with Hamas - Israel News - Haaretz.com",
              },
              {
                date: '2020-09-14T00:00:00Z',
                type: null,
                sourceUrl: 'https://www.ynetnews.com/articles/0,7340,L-4712997,00.html',
                sourceName:
                  "Soldier murdered in Be'er Sheva bus terminal shooting, Eritrean lynched",
              },
            ],
            fitnessProbity: [],
          },
        ],
        clientId: '7a5a10eb-e01d-4896-a717-9017ab3f84d1',
        checkType: 'initial_result',
        createdAt: '2025-05-11T14:54:58.966Z',
        endUserId: 'cm9vhp2nn000wphf4xaocp9v1',
        matchStatus: 'possible_match',
      };
      const document = {
        type: {
          value: 'DRIVERS_LICENSE',
        },
        number: {
          value: '3390227',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        country: {
          value: 'IL',
        },
        validFrom: {
          value: '2025-03-11',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        firstIssue: null,
        validUntil: {
          value: '2027-03-11',
          sources: ['VIZ'],
          confidenceCategory: 'high',
        },
        placeOfIssue: null,
        licenseNumber: null,
        processNumber: null,
        residencePermitType: null,
        city: null,
        issueNumber: null,
      };

      // Act
      const formattedIndividualVerification = formatIndividualVerification({
        decision,
        decisionScore,
        reason,
        person,
        insights,
        aml,
        document,
      });

      // Assert
      expect(formattedIndividualVerification).toMatchObject({
        entity: {
          type: 'individual',
          data: {
            firstName: person.firstName?.value,
            lastName: person.lastName?.value,
            dateOfBirth: person.dateOfBirth?.value,
            additionalInfo: {
              gender: person.gender?.value,
              nationality: person.nationality?.value,
              placeOfBirth: null,
              address: person.address?.value,
            },
          },
        },
        decision: {
          riskLabels: [],
          status: decision,
          decisionReason: reason,
          decisionScore,
        },
        aml,
      });
    });
  });
});
