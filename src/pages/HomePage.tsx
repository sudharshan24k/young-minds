import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-purple-50">
        {/* Sparkle blobs */}
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-yellow-100/50 blur-2xl" />
        <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-40 w-40 rounded-full bg-purple-100/50 blur-2xl" />
      </div>

      {/* Hero content */}
      <Container className="py-20 text-center sm:py-32">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to Young Minds @ Edura
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Fuel your world of endless imagination
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Do you have a head full of stories, doodles, poems, or big ideas? At
          Young Minds @ Edura, your imagination has no limits!
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/express">
            <Button variant="primary">Express Yourself</Button>
          </Link>
          <Link to="/challenge">
            <Button variant="secondary">Challenge Yourself</Button>
          </Link>
          <Link to="/brainy">
            <Button variant="ghost">Brainy Bites</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}