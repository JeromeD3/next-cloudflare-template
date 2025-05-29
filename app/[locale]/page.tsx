import { getTranslations } from 'next-intl/server'

import Background from '@/components/ui/LandingBackground'

export default async function Home() {
  const t = await getTranslations('HomePage')
  return (
    <>
      <Background />
      <div className="bg-zGray-950 relative flex min-h-svh w-full items-center justify-center text-5xl">
        {t('title')}
      </div>
    </>
  )
}
