'use client';
import { useState,useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo-white.png';
import profileDefault from '@/assets/images/profile.png';
import { FaGoogle } from 'react-icons/fa';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  
  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
  
      setProviders(res);
    };
  
    setAuthProviders();
  }, []);
console.dir(providers);  
  const SignInButtons=providers.map((provider)=>{return (
    <button
      onClick={() => signIn(provider?.id)}
      className='flex items-center space-x-2 focus:outline-none'
    >
      <FaGoogle className='text-red-500' />
      <span className='text-white font-semibold'>Sign In with {provider.name}</span>
    </button>
  );});
  return (
    <nav className='bg-blue-700 border-b border-blue-500'>
      <div className='container mx-auto flex items-center justify-between'>
        <Link href='/'>
          <a>
            <Image src={logo} alt='logo' width={150} height={50} />
          </a>
        </Link>
        <div className='hidden md:flex items-center space-x-3'>
          <Link href='/'>
            <a className='text-white font-semibold'>Home</a>
          </Link>
          <Link href='/about'>
            <a className='text-white font-semibold'>About</a>
          </Link>
          <Link href='/contact'>
            <a className='text-white font-semibold'>Contact</a>
          </Link>
          <Link href='/dashboard'>
            <a className='text-white font-semibold'>Dashboard</a>
          </Link>
          {session ? (
            <div className='relative'>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className='flex items-center space-x-2 focus:outline-none'
              >
                <Image
                  src={session.user.image || profileDefault}
                  alt='profile'
                  width={30}
                  height={30}
                  className='rounded-full'
                />
                <span className='text-white font-semibold'>
                  {session.user.name}
                </span>
              </button>
              {isProfileMenuOpen && (
                <div className='absolute top-12 right-0 bg-white p-3 shadow-lg rounded-md'>
                  <button
                    onClick={() => signOut()}
                    className='flex items-center space-x-3 focus:outline-none'
                  >
                    <FaGoogle className='text-red-500' />
                    <span className='text-red-500 font-semibold'>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          
          ) : ({SignInButtons})
          }
        </div>
        </div>
</nav>
  );
};
export default Navbar;
