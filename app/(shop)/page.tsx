import Hero from '@/components/Hero'
import CategorySection from '@/components/CategorySection'
import LatestCollection from '@/components/LatestCollection'
import BestSeller from '@/components/BestSeller'
import OurPolicy from '@/components/OurPolicy'
import NewsletterBox from '@/components/NewsletterBox'

import { getCategories } from "@/lib/data";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div>
      <Hero />
      <CategorySection categories={categories} />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}
