// Home Page - Main landing page with hero, features, and CTA sections

import { Helmet } from 'react-helmet-async';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedTournaments from '@/components/home/FeaturedTournaments';
import Benefits from '@/components/home/Benefits';
import CTA from '@/components/home/CTA';

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Inazuma Battle - Premier eSports Tournament Platform</title>
        <meta name="description" content="Join India's premier BGMI tournament platform. Compete in eSports tournaments, win massive prize pools, and rise to legendary status." />
      </Helmet>

      <main>
        <Hero />
        <HowItWorks />
        <FeaturedTournaments />
        <Benefits />
        <CTA />
      </main>
    </>
  );
}
