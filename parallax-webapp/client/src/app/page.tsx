import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HudPoints from '@/components/HudPoints';
import Manifesto from '@/components/Manifesto';
import DepthLayers from '@/components/DepthLayers';
import HoloPanel from '@/components/HoloPanel';
import AccessForm from '@/components/AccessForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main">
        <Hero />
        <Manifesto />
        <DepthLayers />
        <HoloPanel />
        <AccessForm />
      </main>

      <Footer />
    </>
  );
}
