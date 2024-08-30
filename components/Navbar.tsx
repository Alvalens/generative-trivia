"use client";
import { useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { menuLinks } from '@/lib/menu';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './Toggler';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white bg-opacity-30 shadow-md dark:bg-gray-800 dark:bg-opacity-30 fixed w-full backdrop-blur-md border z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold">
              Generative Trivia
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                onClick={() => setIsOpen(false)} // Optional: Close menu if open
              >
                {link.name}
              </Link>
            ))}
          </div>
          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
            {!session ? (
              <Button
                variant={"outline"}
                onClick={() => {
                  window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
                }}
              >
                Sign In
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none dark:text-gray-200 dark:hover:text-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-5 pt-2 pb-3 space-y-1 sm:px-3">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                onClick={() => setIsOpen(false)} 
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-3">
            {!session ? (
              <Button
              variant={"outline"}
                onClick={() => {
                  () => {
                    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
                  }
                  setIsOpen(false); // Close the menu after sign in
                }}
              >
                Sign In
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                onClick={() => {
                  signOut();
                  setIsOpen(false); // Close the menu after sign out
                }}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
