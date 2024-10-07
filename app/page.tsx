import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { X, Facebook, Instagram, Github } from 'lucide-react';

// Import images

import playerIcon from '/public/images/teamgame-player.png';
import teamIcon from '/public/images/teamgame-team.png';
import RobotsBattle from '/public/images/2robots-battle.jpg';
import battleImage from '/public/images/BattleArena.jpg';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-cover bg-center h-screen flex items-center justify-center relative"
           style={{backgroundImage: `url(${battleImage.src})`, marginTop:-100}}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to the Mega War Blockchain Game</h1>
          <p className="text-xl mb-8">Create your player, form a team, and compete in this exciting blockchain-based game!</p>
          <Link href="/app" passHref>
            <Button size="lg" className="mr-4">
              Enter the Game
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            <a href="#learn-more">Learn More</a>
          </Button>
        </div>
      </div>

      {/* How to Play Section */}
      <section id="learn-more" className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:max-w-80 lg:max-w-none">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700 dark:text-blue-300">How to Play</h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-14">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up">
              <div className="flex">
                <div className="w-1/4 flex items-center justify-start rounded-lg">
                  <Image src={playerIcon} alt="Create Player" width={140} height={100} className="rounded-l-lg h-full"/>
                </div>
                <div className="w-4/5 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">1. Create a Player</h3>
                  <p className="text-gray-600 dark:text-gray-300">Sign up and create your unique player profile to start your journey.</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up animation-delay-200">
              <div className="flex">
                <div className="w-1/4 flex items-center justify-start rounded-lg">
                  <Image src={teamIcon} alt="Form Team" width={140} height={80}  className="rounded-l-lg h-full"/>
                </div>
                <div className="w-4/5 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">2. Form a Team</h3>
                  <p className="text-gray-600 dark:text-gray-300">Create your own team or join an existing one to compete with others.</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up animation-delay-200">
              <div className="flex">
                <div className="w-1/4 flex items-center justify-start rounded-lg">
                  <Image src={RobotsBattle} alt="Compete" width={140} height={80} className="rounded-l-lg h-full" />
                </div>
                <div className="w-4/5 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">3. Compete and Win</h3>
                  <p className="text-gray-600 dark:text-gray-300">Participate in exciting challenges and earn rewards on the blockchain.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-cover bg-center text-white"
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80')"}}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">Game Features</h2>
          {/* Add your game features content here */}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-cover bg-center text-white"
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')"}}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">Join Our Community</h2>
          {/* Add your community content here */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">MEGA WAR</h3>
              <p className="text-sm text-gray-300 max-w-md">
                Join the ultimate blockchain-based battle arena. Create your player, form alliances, and compete for glory and rewards in MEGA WAR!
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <X size={24} />
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Github size={24} />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            © 2023 MEGA WAR. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}