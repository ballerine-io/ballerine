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

export const PaymentEnvironment = () => {
  return (
    <Page wrap={false}>
      <Wrapper>
        <Grid>
          <Header
            logoElement={<BallerineLogo />}
            titleElement={
              <Link
                styles={[tw('text-[11px]')]}
                href={'https://example.com'}
                url={new URL('https://example.com').hostname}
              />
            }
            createdAtTimestamp={Date.now()}
          />
          <Section>
            <View style={tw('flex flex-col')}>
              <View style={tw('flex flex-row justify-between mb-8')}>
                <View>
                  <Typography size="title" weight="bold">
                    Payment Environment
                  </Typography>
                </View>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Payment Environment Risk Score</Typography>
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
                <View style={tw('flex flex-row flex-wrap gap-8')}>
                  <View style={tw('flex w-[230px] gap-2 pr-3')}>
                    <List>
                      <ListItem prependIcon={<AlertIcon />}>
                        <Typography>Lorem ipsum dolor sit.</Typography>
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
                  {'An analysis of <website> revealed that it uses ‘<PSP>’ as a payment processor.'}
                </Typography>
              </View>
            </View>
          </Section>

          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Payment Methods
              </Typography>

              <View style={tw('flex flex-col gap-4')}>
                <View style={tw('flex flex-col gap-1')}>
                  <Typography weight="bold">Payment Gateway</Typography>
                  <List>
                    <ListItem iconPosition="middle" prependIcon={<DotIcon size={2} />}>
                      <Typography>Payoneer</Typography>
                    </ListItem>
                  </List>
                </View>
                <View style={tw('flex flex-col gap-1')}>
                  <Typography weight="bold">Secured checkout (HTTPS)</Typography>
                  <Typography>Detected</Typography>
                </View>
                <View style={tw('flex flex-col gap-1')}>
                  <Typography weight="bold">Terms & Conditions Checkbox</Typography>
                  <Typography>Not detected</Typography>
                </View>
              </View>
              <View style={tw('flex flex-col gap-6')}>
                <Typography weight="bold">Image</Typography>
                <View style={tw('flex flex-row justify-center w-full')}>
                  <View style={tw('rounded-[6px] overflow-hidden w-[480px] h-[480px]')}>
                    <Image
                      width={480}
                      height={480}
                      src="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
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
