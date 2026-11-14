import { useEffect } from 'react';
import { Hero } from '../sections/Hero';
import { EmotionalConnection, ProblemAndSolution } from '../sections/Story';
import {
  BookPreview,
  HowItWorks,
  IntroducingBook,
  WhatSheWillLearn,
} from '../sections/Product';
import { AgeAppropriateness, BenefitsForParents } from '../sections/ForParents';
import { Faqs, FinalCta, HowToGetIt, PurchaseBlock } from '../sections/Buy';
import { StickyBuyBar } from '../components/StickyBuyBar';
import { trackViewContent } from '../lib/analytics';

export default function Landing() {
  useEffect(() => {
    trackViewContent();
  }, []);

  return (
    <>
      <Hero />
      <EmotionalConnection />
      <ProblemAndSolution />
      <IntroducingBook />
      <WhatSheWillLearn />
      <BookPreview />
      <HowItWorks />
      <BenefitsForParents />
      <AgeAppropriateness />
      <PurchaseBlock />
      <HowToGetIt />
      <Faqs />
      <FinalCta />
      <StickyBuyBar />
    </>
  );
}
