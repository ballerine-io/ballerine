import {
  AlertIcon,
  BallerineLogo,
  Disclaimer,
  Divider,
  DotIcon,
  Footer,
  Grid,
  Header,
  Image,
  Link,
  List,
  ListItem,
  Section,
  Typography,
  Wrapper,
} from '@/components';
import { Page, View } from '@react-pdf/renderer';
import type { FunctionComponent } from 'react';

import { SocialMediaReportData } from '@/templates/social-media/types/social-media-report-data.type.js';
import { getPageInfoEntries } from '@/templates/social-media/utils/get-page-info-entries';
import { tw } from '@/theme';
import { getRiskScoreStyle, isLink, toTitleCase } from '@/utils';

export type SocialMediaReportProps = {
  data: SocialMediaReportData;
};

export const SocialMedia: FunctionComponent<SocialMediaReportProps> = ({ data }) => {
  const { riskRank, riskIndicators, summary, website, ads } = data;
  const { facebook, instagram } = ads || {};

  return (
    <Page wrap={false}>
      <Wrapper>
        <Grid>
          <Header
            logoElement={<BallerineLogo />}
            titleElement={
              <Link
                styles={[tw('text-[11px]')]}
                href={website.url}
                url={new URL(website.url).hostname}
              />
            }
            createdAtTimestamp={Date.now()}
          ></Header>
          <Section>
            <View style={tw('flex flex-col')}>
              <View style={tw('flex flex-row justify-between pb-8')}>
                <View>
                  <Typography size="heading" weight="bold">
                    Ads and Social Media Analysis
                  </Typography>
                </View>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Ads and Social Media Risk Score</Typography>
                  <View style={tw('flex flex-row justify-end')}>
                    <Typography weight="bold" size="large" color={getRiskScoreStyle(riskRank)}>
                      {riskRank}
                    </Typography>
                  </View>
                </View>
              </View>
              <View style={tw('flex flex-col gap-4')}>
                <Typography size="medium" weight="bold">
                  Risk Indicators
                </Typography>
                {Array.isArray(riskIndicators) && riskIndicators.length > 0 && (
                  <List>
                    {riskIndicators.map(violation => (
                      <ListItem prependIcon={<AlertIcon />} key={violation as string}>
                        <Typography>{violation}</Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </View>
              <Divider styles={[tw('my-6')]} />
              <View style={tw('flex flex-col gap-3')}>
                <Typography weight="bold" size="medium">
                  Risk Summary
                </Typography>
                <Typography size="regular" styles={[tw('leading-6')]}>
                  {summary}
                </Typography>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col')}>
              <View style={tw('pb-6')}>
                <Typography size="heading" weight="bold">
                  Social Media Presence
                </Typography>
              </View>
              <View style={tw('flex flex-row justify-between pb-10')}>
                <View style={tw('w-[230px] pr-2 flex flex-col gap-3 break-all overflow-hidden')}>
                  <Typography weight="bold">Facebook</Typography>
                  <List>
                    {getPageInfoEntries(facebook?.pageInformation).map(({ key, value }) => (
                      <ListItem
                        iconPosition="middle"
                        prependIcon={<DotIcon size={2} />}
                        key={value}
                      >
                        <View style={tw('flex flex-row gap-1')}>
                          <Typography>{toTitleCase(key)}</Typography>
                          <Typography>{':'}</Typography>
                          <Typography>
                            {isLink(value) ? (
                              <Link href={value} url={new URL(value).hostname} />
                            ) : (
                              <Typography>{value}</Typography>
                            )}
                          </Typography>
                        </View>
                      </ListItem>
                    ))}
                  </List>
                </View>
                <View style={tw('w-[230px] pr-2 flex flex-col gap-3 break-all overflow-hidden')}>
                  <Typography weight="bold">Instagram</Typography>
                  <List>
                    {getPageInfoEntries(instagram?.pageInformation).map(({ key, value }) => (
                      <ListItem prependIcon={<DotIcon size={2} />} key={value}>
                        <View style={tw('flex flex-row gap-1')}>
                          <Typography>{toTitleCase(key)}</Typography>
                          <Typography>{':'}</Typography>
                          <Typography>
                            {isLink(value) ? (
                              <Link href={value} url={new URL(value).hostname} />
                            ) : (
                              <Typography>{value}</Typography>
                            )}
                          </Typography>
                        </View>
                      </ListItem>
                    ))}
                  </List>
                </View>
              </View>
              {/*Violations should be here*/}
              {/* <View style={tw('flex flex-col gap-3 pb-10')}>
              <Typography weight="bold">Violations Detected</Typography>
              <List>
                <ListItem prependIcon={<AlertIcon />}>
                  <Typography>Illegal Substances</Typography>
                </ListItem>
                <ListItem prependIcon={<AlertIcon />}>
                  <Typography>Potential Pharmaceuticals</Typography>
                </ListItem>
              </List>
            </View> */}
              <View style={tw('flex flex-row justify-between')}>
                {facebook?.imageUrl && (
                  <View style={tw('flex flex-col gap-3')}>
                    {/* FACEBOOK */}
                    <Typography weight="bold">Image</Typography>
                    <View style={tw('pl-2')}>
                      <View style={tw('rounded-[6px] overflow-hidden')}>
                        <Image width={260} height={260} src={facebook.imageUrl} />
                      </View>
                    </View>
                    {facebook?.link && (
                      <View style={tw('pt-2')}>
                        <Link href={facebook.link}></Link>
                      </View>
                    )}
                  </View>
                )}

                {/* INSTAGRAM */}
                {instagram?.imageUrl && (
                  <View style={tw('flex flex-col gap-3')}>
                    {/* FACEBOOK */}
                    <Typography weight="bold">Image</Typography>
                    <View style={tw('pl-2')}>
                      <View style={tw('rounded-[6px] overflow-hidden')}>
                        <Image width={260} height={260} src={instagram.imageUrl} />
                      </View>
                    </View>
                    {instagram?.link && (
                      <View style={tw('pt-2')}>
                        <Link href={instagram.link}></Link>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('pb-6')}>
              <Typography size="heading" weight="bold">
                Related Ads
              </Typography>
            </View>
            {/*Violations should be here*/}
            {/* <View style={tw('flex flex-col gap-3 pb-6')}>
            <Typography weight="bold">Violations Detected</Typography>
            <List>
              <ListItem prependIcon={<AlertIcon />}>
                <Typography>Illegal Substances</Typography>
              </ListItem>
              <ListItem prependIcon={<AlertIcon />}>
                <Typography>Potential Pharmaceuticals</Typography>
              </ListItem>
            </List>
          </View> */}
            {/* Ads summary */}
            {/* <View style={tw('flex flex-col gap-3 pb-6')}>
            <Typography weight="bold" size="medium">
              Ads Summary
            </Typography>
            <Typography size="regular" styles={[tw('leading-6')]}>
              Ballerine detected {'<number>'} ads that are operated by {'<website>'}. The analysis
              of the ads reveals no immediate red flags or inconsistencies that would suggest
              transaction laundering activities.
            </Typography>
          </View> */}
            <View style={tw('flex flex-row justify-between')}>
              {facebook?.pickedAd?.imageUrl && (
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Facebook</Typography>
                  <View style={tw('pl-2')}>
                    <View style={tw('rounded-[6px] overflow-hidden')}>
                      <Image width={260} height={260} src={facebook.pickedAd.imageUrl} />
                    </View>
                  </View>
                  <View style={tw('pt-2')}>
                    <Link href={facebook?.pickedAd?.link} />
                  </View>
                </View>
              )}
              {instagram?.pickedAd?.imageUrl && (
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Instagram</Typography>
                  <View style={tw('pl-2')}>
                    <View style={tw('rounded-[6px] overflow-hidden')}>
                      <Image width={260} height={260} src={instagram?.pickedAd?.imageUrl} />
                    </View>
                  </View>

                  <View style={tw('pt-2')}>
                    <Link href={instagram?.pickedAd?.link} />
                  </View>
                </View>
              )}
            </View>
          </Section>
          <Footer
            domain="www.ballerine.com"
            contactEmail="support@ballerine.com"
            companyName="Ballerine"
          />
          <Disclaimer />
        </Grid>
      </Wrapper>
    </Page>
  );
};
