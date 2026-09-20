import AIFeaturesPreview from "../components/AIFeaturesPreview";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import HeroSection from "../components/HeroSection";
import ProcurementCTA from "../components/ProcurementCTA";
import { ErrorState, LoadingState } from "../../../components/feedback";
import { useHomeContent } from "../hooks/useHomeContent";

const HomePage = ({ onOpenAiAssistant }) => {
  const { content, error, isLoading, isRemote, refetch } = useHomeContent();

  if (isLoading && isRemote) {
    return <div className="content-container py-12"><LoadingState label="Preparing your farm dashboard…" /></div>;
  }

  if (error && isRemote) {
    return <div className="content-container py-12"><ErrorState message="The landing-page service did not respond. Please try again." onRetry={refetch} /></div>;
  }

  return (
    <div>
      <HeroSection hero={content.hero} />
      <CategoryGrid categories={content.categories} />
      <FeaturedProducts products={content.featuredProducts} />
      <AIFeaturesPreview onOpenAiAssistant={onOpenAiAssistant} />
      <ProcurementCTA />
    </div>
  );
};

export default HomePage;
