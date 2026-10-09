import PageTransition from '../components/PageTransition.jsx';
import Hero from '../components/home/Hero.jsx';
import FeaturedDishes from '../components/home/FeaturedDishes.jsx';
import WhyChooseUs from '../components/home/WhyChooseUs.jsx';
import SpecialOffer from '../components/home/SpecialOffer.jsx';
import Reviews from '../components/home/Reviews.jsx';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <FeaturedDishes />
      <WhyChooseUs />
      <SpecialOffer />
      <Reviews />
    </PageTransition>
  );
}
