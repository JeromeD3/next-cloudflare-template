import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')
  return <div className="min-h-dvh"></div>
}
