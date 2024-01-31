import {
  AlertIcon,
  Badge,
  BallerineLogo,
  CheckSquareIcon,
  Divider,
  DotIcon,
  Footer,
  Grid,
  Header,
  List,
  ListItem,
  Section,
  Typography,
  Wrapper,
} from '@/components';
import { Disclaimer } from '@/components/layouts/Disclaimer';
import { tw } from '@/theme';
import { Page, View } from '@react-pdf/renderer';

export const Summary = () => {
  return (
    <Page wrap={false}>
      <Wrapper>
        <Grid>
          <Header
            logoElement={<BallerineLogo />}
            titleElement={null}
            createdAtTimestamp={Date.now()}
          />
          <Section>
            <View style={tw('flex flex-col')}>
              <View style={tw('flex flex-row justify-between items-center mb-8')}>
                <View>
                  <Typography size="title" weight="bold">
                    Example.com
                  </Typography>
                </View>
                <View style={tw('flex flex-col gap-1')}>
                  <Typography weight="bold">Overall Risk Level</Typography>
                  <View style={tw('flex flex-row gap-2 items-center')}>
                    <Typography size="large" color="warning" weight="bold">
                      75
                    </Typography>
                    <Badge text="High Risk" variant="warning" />
                  </View>
                </View>
              </View>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold" size="heading">
                  Risk Summary
                </Typography>
                <Typography styles={[tw('text-justify leading-6')]}>
                  Planet-of-mushrooms.com poses a high transaction laundering risk, meriting a score
                  of 80 out of 100. This evaluation stems from its focus on selling products for
                  growing Psilocybe Cubensis, a substance often associated with legal restrictions.
                  The site's inconsistencies in business practices further elevate the risk. These
                  factors, combined with problematic website structure and suspicious traffic
                  patterns, including erratic visitor numbers and engagement metrics, highlight
                  significant concerns about potential misuse, scams, fraud, and money laundering
                  activities. This assessment underscores the need for vigilance and further
                  scrutiny of the site's operations.
                </Typography>
              </View>
              <Divider styles={[tw('my-6')]} />
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold" size="heading">
                  Risk Indicators
                </Typography>
                <View style={tw('flex flex-row flex-wrap gap-8')}>
                  <View style={tw('flex w-[230px] gap-2 pr-3')}>
                    <Typography weight="bold">Line of Business</Typography>
                    <List>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus
                          quasi nostrum, natus at molestiae modi sit illum ut obcaecati.
                        </Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                    </List>
                  </View>
                  <View style={tw('flex w-[230px] gap-2 pr-3')}>
                    <Typography weight="bold">Line of Business</Typography>
                    <List>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus
                          quasi nostrum, natus at molestiae modi sit illum ut obcaecati.
                        </Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                    </List>
                  </View>
                  <View style={tw('flex w-[230px] gap-2 pr-3')}>
                    <Typography weight="bold">Line of Business</Typography>
                    <List>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus
                          quasi nostrum, natus at molestiae modi sit illum ut obcaecati.
                        </Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                    </List>
                  </View>
                  <View style={tw('flex w-[230px] gap-2 pr-3')}>
                    <Typography weight="bold">Line of Business</Typography>
                    <List>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus
                          quasi nostrum, natus at molestiae modi sit illum ut obcaecati.
                        </Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                    </List>
                  </View>
                  <View style={tw('flex w-[230px] gap-2 pr-3')}>
                    <Typography weight="bold">Line of Business</Typography>
                    <List>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>
                          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus
                          quasi nostrum, natus at molestiae modi sit illum ut obcaecati.
                        </Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Illegal Substances</Typography>
                      </ListItem>
                    </List>
                  </View>
                </View>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-4 w-[500px]')}>
              <Typography weight="bold" size="heading">
                Recomendations
              </Typography>
              <List>
                <ListItem prependIcon={<CheckSquareIcon />}>
                  <Typography>
                    The company is advised to reassess its relationship with Example.com.
                  </Typography>
                </ListItem>
                <ListItem prependIcon={<CheckSquareIcon />}>
                  <Typography>
                    The company is advised to verify that all products sold on Example.com are
                    legitimate and that the website has the necessary permissions to sell branded
                    items.
                  </Typography>
                </ListItem>
                <ListItem prependIcon={<CheckSquareIcon />}>
                  <Typography>
                    Request the merchant to provide a comprehensive returns policy.
                  </Typography>
                </ListItem>
                <ListItem prependIcon={<CheckSquareIcon />}>
                  <Typography>
                    Verify the merchant's adherence to regulations pertaining to advertisements,
                    especially concerning illegal substances. Ensure all advertising practices
                    comply with local and international laws.
                  </Typography>
                </ListItem>
                <ListItem prependIcon={<CheckSquareIcon />}>
                  <Typography>
                    As the merchant’s traffic is mostly direct, it is advised to reduce the
                    merchant’s transaction limits.
                  </Typography>
                </ListItem>
                <ListItem prependIcon={<CheckSquareIcon />}>
                  <Typography>
                    The company is advised to reassess its relationship with Example.com.
                  </Typography>
                </ListItem>
              </List>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-4')}>
              <Typography weight="bold" size="heading">
                Checks Conducted
              </Typography>
              <View style={tw('flex flex-row flex-wrap gap-8')}>
                <View style={tw('flex w-[230px] gap-2 pr-3')}>
                  <Typography weight="bold">Line of Business</Typography>
                  <List>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#007AFF" />}
                      iconPosition="middle"
                    >
                      <Typography>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus quasi
                        nostrum, natus at molestiae modi sit illum ut obcaecati.
                      </Typography>
                    </ListItem>
                    <ListItem prependIcon={<DotIcon size={6} color="#D9D9D9" />}>
                      <Typography>Illegal Substances</Typography>
                    </ListItem>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#007AFF" />}
                      iconPosition="middle"
                    >
                      <Typography>Illegal Substances</Typography>
                    </ListItem>
                  </List>
                </View>
                <View style={tw('flex w-[230px] gap-2 pr-3')}>
                  <Typography weight="bold">Ecosystem</Typography>
                  <List>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#007AFF" />}
                      iconPosition="middle"
                    >
                      <Typography>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus quasi
                        nostrum, natus at molestiae modi sit illum ut obcaecati.
                      </Typography>
                    </ListItem>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#007AFF" />}
                      iconPosition="middle"
                    >
                      <Typography>Illegal Substances</Typography>
                    </ListItem>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#D9D9D9" />}
                      iconPosition="middle"
                    >
                      <Typography>Illegal Substances</Typography>
                    </ListItem>
                  </List>
                </View>
                <View style={tw('flex w-[230px] gap-2 pr-3')}>
                  <Typography weight="bold">Transaction Laundering Risk</Typography>
                  <List>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#D9D9D9" />}
                      iconPosition="middle"
                    >
                      <Typography>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel delectus quasi
                        nostrum, natus at molestiae modi sit illum ut obcaecati.
                      </Typography>
                    </ListItem>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#D9D9D9" />}
                      iconPosition="middle"
                    >
                      <Typography>Illegal Substances</Typography>
                    </ListItem>
                    <ListItem
                      prependIcon={<DotIcon size={6} color="#D9D9D9" />}
                      iconPosition="middle"
                    >
                      <Typography>Illegal Substances</Typography>
                    </ListItem>
                  </List>
                </View>
              </View>
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
