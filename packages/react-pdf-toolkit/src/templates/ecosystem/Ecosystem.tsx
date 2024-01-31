import {
  AlertIcon,
  BallerineLogo,
  Disclaimer,
  Footer,
  Grid,
  Header,
  Link,
  List,
  ListItem,
  Section,
  Typography,
  Wrapper,
} from '@/components';
import { tw } from '@/theme';
import { Page, View } from '@react-pdf/renderer';

const TransactionsTableHead = () => {
  return (
    <View style={tw('flex flex-row gap-2 mb-2')}>
      <View style={tw('flex-1')}>
        <Typography weight="bold">Transaction ID</Typography>
      </View>
      <View style={tw('flex-1')}>
        <Typography weight="bold">Date & Time</Typography>
      </View>
      <View style={tw('flex-1')}>
        <Typography weight="bold">Amount</Typography>
      </View>
      <View style={tw('flex-1')}>
        <Typography weight="bold">Currency</Typography>
      </View>
      <View style={tw('flex-1')}>
        <Typography weight="bold">ICA</Typography>
      </View>
      <View style={tw('flex-1')}>
        <Typography weight="bold">Merchant ID</Typography>
      </View>
      <View style={tw('flex-1')}>
        <Typography weight="bold">Merchant Name</Typography>
      </View>
    </View>
  );
};

const DomainsTable = () => {
  return (
    <View style={tw('flex flex-col')}>
      <View style={tw('flex flex-row gap-2 mb-2')}>
        <View style={tw('w-[20%]')}>
          <Typography weight="bold">Domain</Typography>
        </View>
        <View style={tw('w-[20%]')}>
          <Typography weight="bold">Related node type</Typography>
        </View>
        <View style={tw('w-[40%]')}>
          <Typography weight="bold">Related node</Typography>
        </View>
        <View style={tw('w-[20%]')}>
          <Typography weight="bold">Indicators</Typography>
        </View>
      </View>
      <View style={tw('flex flex-col gap-2')}>
        <View style={tw('flex flex-row gap-2')}>
          <View style={tw('w-[20%]')}>
            <Typography size="small">ilovemushrooms.com</Typography>
          </View>
          <View style={tw('w-[20%]')}>
            <Typography size="small">Address</Typography>
          </View>
          <View style={tw('w-[40%]')}>
            <Typography size="small">Shunit 71 Beit Herut, Israel, 40291</Typography>
          </View>
          <View style={tw('w-[20%]')}>
            <Typography size="small">Suspected Scam</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row gap-2')}>
          <View style={tw('w-[20%]')}>
            <Typography size="small">legalpharmaceuticals.com</Typography>
          </View>
          <View style={tw('w-[20%]')}>
            <Typography size="small">Company Name</Typography>
          </View>
          <View style={tw('w-[40%]')}>
            <Typography size="small">COMPANY EXAMPLE LTD</Typography>
          </View>
          <View style={tw('w-[20%]')}>
            <Typography size="small">Prescription Drugs </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

const TransactionsList = () => {
  return (
    <View style={tw('flex flex-col')}>
      <View style={tw('flex flex-col gap-2')}>
        <TransactionsTableHead />
        <View style={tw('flex flex-row gap-2')}>
          <View style={tw('flex-1')}>
            <Typography size="small">1231231231</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">12/02/1986 13:40:22</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">4329</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">USD</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">12345</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">123123YNSJH421J</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">COMPANY EXAMPLE LTD +12345</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row gap-2')}>
          <View style={tw('flex-1')}>
            <Typography size="small">1231231231</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">12/02/1986 13:40:22</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">4329</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">USD</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">Lorem ipsum dolor sit amet.</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">Lorem, ipsum dolor.</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">COMPANY EXAMPLE LTD +12345</Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

const TransactionsEmptyList = () => {
  return (
    <View style={tw('flex flex-col')}>
      <View style={tw('flex flex-col gap-2')}>
        <TransactionsTableHead />
        <View style={tw('flex flex-row gap-2')}>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
          <View style={tw('flex-1')}>
            <Typography size="small">N/A</Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

export const Ecosystem = () => {
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
                    Ecosystem Analysis
                  </Typography>
                </View>
                <View style={tw('flex flex-col gap-3')}>
                  <Typography weight="bold">Ecosystem Risk Score</Typography>
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
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Ecosystem Domains
              </Typography>
              <Typography>
                No problematic websites were detected within the website's ecosystem. / 10
                problematic websites were detected within the website's ecosystem
              </Typography>
              <DomainsTable />
            </View>
          </Section>
          <Section>
            <View style={tw('flex flex-col gap-6')}>
              <Typography size="large" weight="bold">
                Test Transactions
              </Typography>
              <View style={tw('flex flex-col gap-3')}>
                <Typography weight="bold">Synthetic Transactions</Typography>
                <Typography>
                  <Typography color="silent">Not Performed</Typography>
                  <Typography color="silent"> / </Typography>
                  <Typography>Performed</Typography>
                </Typography>
              </View>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">ilovemushrooms.com</Typography>
                <TransactionsList />
              </View>
              <View style={tw('flex flex-col gap-4')}>
                <Typography weight="bold">legalpharmaceuticals.com</Typography>
                <TransactionsEmptyList />
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
