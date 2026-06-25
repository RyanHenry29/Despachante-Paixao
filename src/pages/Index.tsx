import { useRef, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ContactForm from "@/components/ContactForm";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import ScrollNavigation from "@/components/ScrollNavigation";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState("");

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    scrollToForm();
  };

  return (
    <div className="min-h-screen">
      <Header onScrollToForm={scrollToForm} />
      <HeroSection onScrollToForm={scrollToForm} />
      <ServicesSection onSelectService={handleSelectService} />
      <ContactForm ref={formRef} selectedService={selectedService} />
      <GoogleReviewsSection />
      <TrustSection />
      <Footer />
      <ChatBot />
      <ScrollNavigation />
    </div>
  );
};

export default Index;
