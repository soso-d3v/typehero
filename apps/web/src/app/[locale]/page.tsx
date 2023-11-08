import { setStaticParamsLocale } from 'next-international/server';
import { Footsies } from '~/components/footsies';
import { Community } from './_components/community/community';
import { Features } from './_components/features';
import { Hero } from './_components/hero';
import { Ghost } from './_components/hero-ghost';
import { WaitlistBanner } from './_components/waitlist-banner';

export default async function Index({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  return (
    <>
      <Ghost />
      <Hero />
      <Features />
      <Community />
      <WaitlistBanner />
      <Footsies />
    </>
  );
}
