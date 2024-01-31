import { SocialMedia } from '@/templates/social-media/SocialMedia';
import { SocialMediaReportData } from '@/templates/social-media/types/social-media-report-data.type';
import { registerFont } from '@/theme';
import { Font } from '@react-pdf/renderer';
import { _PDFTemplateBase } from '../../_storybook/components/_PDFTemplateBase';

registerFont(Font);

export default {
  component: SocialMedia,
};

const socialMediaReportData: SocialMediaReportData = {
  website: {
    url: 'https://example.com',
  },
  riskRank: 90,
  riskIndicators: ['Illegal Substances', 'Illegal Substances'],
  summary:
    'Multiple sources indicate that ‘Umall Technology S.A.R.L’ is a shell company involved in operating a network of fake shopping sites, which is a common sign of transaction laundering.',
  ads: {
    facebook: {
      pageInformation: {
        facebookPage: 'Height Increasing Elevator Shoes',
        facebookID: '203247813140137',
        creationDate: '23 Dec, 2048',
        categories: 'Page, Business & Economy Website',
        address: '238 Duoxi, lunjiao shunde',
        phoneNumber: '+86 186 6452 0856',
        email: 'service@topoutshoes.com',
        likes: '3.5K',
        followers: '3.3K',
      },
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
      link: 'https://facebook.com',
      pickedAd: {
        imageUrl:
          'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
        link: 'https://facebook.com',
      },
    },
    instagram: {
      pageInformation: {
        instagramPage: '@topoutshoes',
        fullName: 'Topoutshoes',
        creationDate: new Date(),
        businessCategoryName: 'Shopping & retail',
        biography:
          'TopoutShoes is a men’s shoes store online. Elevator shoes and height increasing tall shoes to build up for short men to add height with shoe lifts',
        followers: 5714,
        isBusinessAccount: false,
        verified: false,
      },
      link: 'https://instagram.com',
      imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      pickedAd: {
        link: 'https://instagram.com',
        imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      },
    },
  },
};

export const SocialMediaTemplate = {
  render: () => (
    <_PDFTemplateBase>
      <SocialMedia data={socialMediaReportData} />
    </_PDFTemplateBase>
  ),
};
