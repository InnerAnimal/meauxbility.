import AnnouncementBanner from '@/components/AnnouncementBanner'
import HeroSection from '@/components/HeroSection'
import ValuesSection from '@/components/ValuesSection'
import GapSection from '@/components/GapSection'
import CampaignSection from '@/components/CampaignSection'

export const metadata = {
  title: 'Meauxbility | Empowering Mobility. Restoring Independence.',
  description: 'Supporting spinal cord injury survivors across Acadiana with grants for adaptive equipment and accessibility services.',
}

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <HeroSection />
      <ValuesSection />
      <GapSection />
      <CampaignSection />
    </>
  )
}
