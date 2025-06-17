
import PageLayout from '@/components/PageLayout';
import HireAIHero from '@/components/HireAIHero';
import HireAIFeatures from '@/components/HireAIFeatures';
import HireAIProcess from '@/components/HireAIProcess';
import SEO from '@/components/SEO';

// On landing page, we do NOT want showContact (which includes <FloatingContactButton /> and ContactInfo)
const Index = () => {
  return (
    <PageLayout showContact={false}>
      <SEO 
        title="HireAI - Revolutionizing Recruitment with AI" 
        description="Join the waitlist for HireAI - the AI-powered recruitment platform that streamlines hiring, automates processes, and helps recruiters find the perfect candidates faster."
        imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
        keywords={['AI recruitment', 'hiring automation', 'recruiter tools', 'talent acquisition', 'HR technology', 'automated screening']}
      />
      <HireAIHero />
      <HireAIFeatures />
      <HireAIProcess />
    </PageLayout>
  );
};

export default Index;
