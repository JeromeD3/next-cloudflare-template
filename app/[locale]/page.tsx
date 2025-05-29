import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')
  return (
    <div className="bg-zGray-950 relative flex min-h-svh w-full items-center justify-center text-5xl">{t('title')}</div>
  )
}
