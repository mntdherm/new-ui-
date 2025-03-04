import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUser } from '../lib/db';
import { LogOut, Menu, X, User, Store, Package, Tag, Coins, Calendar } from 'lucide-react';

const Navbar = () => {
  const [currentWord, setCurrentWord] = useState('Autopesu');
  const words = ['Autopesu', 'detailing', 'pikahuolto'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentWord(words[wordIndex]);
  }, [wordIndex]);

  // ... (rest of the component logic)

  return (
    <nav className="bg-bilo-gray/80 shadow-sm relative ios-blur fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-bold bilo-text mr-2">Bilo</span>
              <div className="text-sm flex items-center">
                <span className="text-bilo-navy mr-1">Nykyajan</span>
                <span className="changing-word font-medium">{currentWord}</span>
              </div>
            </Link>
          </div>

          {/* ... (rest of the component remains unchanged) */}
        </div>
      </div>
      
      {/* ... (mobile navigation remains unchanged) */}
    </nav>
  );
};

export default Navbar;
