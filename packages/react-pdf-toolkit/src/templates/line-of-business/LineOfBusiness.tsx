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
import { tw } from '@/theme';
import { Page, View } from '@react-pdf/renderer';

export const LineOfBusiness = () => {
  return (
    <Page wrap={false}>
      <Wrapper>
        <Grid>
          <Header
            logoElement={<BallerineLogo />}
            titleElement={
              <Link
                styles={[tw('text-[11px]')]}
                href={'https://Fashiontiy.com'}
                url={new URL('https://Fashiontiy.com').hostname}
              />
            }
            createdAtTimestamp={Date.now()}
          />
          <Section>
            <View style={tw('flex flex-col')}>
              <View style={tw('flex flex-row justify-between mb-8')}>
                <View>
                  <Typography size="title" weight="bold">
                    Line of Business Analysis
                  </Typography>
                </View>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">LOB Risk Score</Typography>
                  <View style={tw('flex flex-row justify-end')}>
                    <Typography weight="bold" size="large" color={'error'}>
                      90
                    </Typography>
                  </View>
                </View>
              </View>

              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold" size="heading">
                  Risk Indicators
                </Typography>
                <View style={tw('flex flex-row flex-wrap gap-8 w-[520px]')}>
                  <View style={tw('flex w-[240px] gap-2')}>
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
                  <View style={tw('flex w-[240px] gap-2')}>
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
                  <View style={tw('flex w-[240px] gap-2')}>
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
                  <View style={tw('flex w-[240px] gap-2')}>
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
                  <View style={tw('flex w-[240px] gap-2')}>
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
              <Divider styles={[tw('my-6')]} />
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
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Line of Business Summary
              </Typography>
              <View style={tw('flex flex-col gap-2')}>
                <Typography weight="bold">LOB Description</Typography>
                <Typography>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis aut ad animi
                  repellendus in nobis ipsum modi tempora error magni? Explicabo deleniti id impedit
                  dignissimos?
                </Typography>
              </View>
              <View style={tw('flex flex-col gap-2')}>
                <Typography weight="bold">MCC Provided</Typography>
                <Typography color="silent">
                  Not Provided / 12345 - Women Clothing and Apparel
                </Typography>
              </View>
              <View style={tw('flex flex-col gap-2')}>
                <Typography weight="bold">MCC Matching</Typography>
                <Typography color="silent">Not Checked</Typography>
              </View>
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Content Violations Summary
              </Typography>
              <View style={tw('flex flex-col gap-2 w-[520px]')}>
                <Typography weight="bold">Findings</Typography>
                <List>
                  <ListItem iconPosition={'middle'} prependIcon={<DotIcon size={2} />}>
                    <Typography styles={[tw('text-justify')]}>
                      IP Rights Infringement - The website displays products that appear to infringe
                      on intellectual property rights, with a notable example being the "NIGO
                      Vintage Sneakers Casual Shoes." These sneakers bear a significant resemblance
                      to Balenciaga's 3XL Sneakers, both in design and style, but are offered at a
                      much lower price ($225 on nigoo.store compared to $1150 on Balenciaga's
                      official store). This similarity suggests potential IP rights infringement,
                      indicating that nigoo.store may be selling counterfeit versions of high-end
                      brand products. This instance raises the possibility that other products on
                      the site may also violate IP rights.
                    </Typography>
                  </ListItem>
                </List>
              </View>
              <View style={tw('flex flex-row justify-between')}>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Violation Image</Typography>
                  <View style={tw('pl-2')}>
                    <View style={tw('rounded-[6px] overflow-hidden')}>
                      <Image
                        width={260}
                        height={260}
                        src={
                          'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
                        }
                      />
                    </View>
                  </View>
                  <View style={tw('pt-2')}>
                    <Link
                      href={
                        'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
                      }
                      url="https://hips.hearstapps.com"
                    />
                  </View>
                </View>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Violated IP</Typography>
                  <View style={tw('pl-2')}>
                    <View style={tw('rounded-[6px] overflow-hidden')}>
                      <Image
                        width={260}
                        height={260}
                        src={
                          'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
                        }
                      />
                    </View>
                  </View>

                  <View style={tw('pt-2')}>
                    <Link
                      href={
                        'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*'
                      }
                      url="https://hips.hearstapps.com"
                    />
                  </View>
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
