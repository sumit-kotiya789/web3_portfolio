import { Section, Heading, Reveal } from '../components/ui'
import ContractReader from '../components/ContractReader'
import TokenGate from '../components/TokenGate'
import Guestbook from '../components/Guestbook'

export default function Lab() {
  return (
    <Section style={{ paddingTop: 130 }}>
      <Heading
        eyebrow="On-Chain Lab"
        title="WEB3 PLAYGROUND"
        gradient="text-grad-ocean"
        center
        sub="Interactive, fully on-chain tools — read any contract's live state, and unlock a members area by holding TAAQO."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20, alignItems: 'start' }}>
        <Reveal>
          <ContractReader />
        </Reveal>
        <Reveal delay={0.12}>
          <TokenGate />
        </Reveal>
      </div>

      <div style={{ marginTop: 24 }}>
        <Reveal>
          <Guestbook />
        </Reveal>
      </div>
    </Section>
  )
}
