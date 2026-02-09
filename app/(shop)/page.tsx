import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import LatestCollection from '@/components/LatestCollection'
import BestSeller from '@/components/BestSeller'
import OurPolicy from '@/components/OurPolicy'
import NewsletterBox from '@/components/NewsletterBox'

export default function Home() {
  return (
    <div>
      <Hero />
      <CategorySection />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}
