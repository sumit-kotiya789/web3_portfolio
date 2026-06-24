import HeroSection from '../sections/HeroSection'
import WorkSection from '../sections/WorkSection'
import {
  AboutSection,
  SkillsSection,
  ExperienceSection,
  StackSection,
  OpenSourceSection,
  ContactSection,
} from '../sections/sections'

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <WorkSection />
      <StackSection />
      <OpenSourceSection />
      <ContactSection />
    </>
  )
}
