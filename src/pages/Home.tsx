
import React from "react";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Benefits } from "@/components/home/Benefits";
import { DemoSection } from "@/components/home/DemoSection";
import { PricingPlans } from "@/components/home/PricingPlans";
import { CTASection } from "@/components/home/CTASection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHeader } from "@/components/home/HomeHeader";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HomeHeader />
      <Hero />
      <Features />
      <Benefits />
      <DemoSection />
      <PricingPlans />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default Home;
