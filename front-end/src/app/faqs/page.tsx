"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Heading as="h4" size="sm" paddingBottom={4} paddingTop={4}>
        Frequently Asked Questions
      </Heading>

      <Accordion defaultIndex={[0]} allowToggle>
        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                What is Stekcit BwC?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>

          <AccordionPanel pb={4}>
            Stekcit BwC, stylized as “Stek•cit BwC” is a mobile-first, online
            ticketing marketplace that leverages the trust value of the
            blockchain to give event creators and event attendees a better and
            safer experience.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                How does the web app work?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <Text>1. You create an account.</Text>
            <Text>2. You create an event.</Text>
            <Text>3. You verify your event.</Text>
            <Text>4. You publish it.</Text>
            <Text>
              5. You promote it on your social networks, and people sign up to
              the web app
            </Text>
            <Text>
              6. They buy tickets. Once the event is done, you request a payout.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                How can I earn from Stekcit BwC?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>

          <AccordionPanel pb={4}>
            As a Creating User (capable of uploading events), you can create an
            event and set a ticket price (say 2 cUSD), and promote it within
            your social network. People will pay and after a successful event,
            you can request payout via the web app.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                How much can I make from Stekcit BwC?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>

          <AccordionPanel pb={4}>
            You get back 80% of the generated revenue, while the rest of the
            earnings go to the owner of Stekcit BwC takes 20%. That is way
            better than the 30+% that Eventbrite takes.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                What type of events are best for Stekcit BwC?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>

          <AccordionPanel pb={4}>
            For our MVP (version 1.0.0), the best events are online-based, say
            via Google Meet or Zoom. These do not require the planning overhead
            that comes with physical meetings, and they help you focus on
            offering value for your attendees. A good example of an event would
            be an online Blockchain 101 class.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                What powers Stekcit BwC?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>

          <AccordionPanel pb={4}>
            Stekcit BwC runs on top of the Celo blockchain, a L1, EVM-based
            chain that borrows from Optimism superchain.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Heading>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                What is the difference between verified and unverified events?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>

          <AccordionPanel pb={4}>
            If you see blue checkmark next to an event, it means that the
            creator paid 10% of the ticket fee for better visibility and more
            credibility.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
