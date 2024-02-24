'use client';
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useState,useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo-white.png';
import profileDefault from '@/assets/images/profile.png';
import { FaGoogle } from 'react-icons/fa';
import { useUser } from "@clerk/nextjs";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [providers, setProviders] = useState(null);
    const { isLoaded, isSignedIn, user } = useUser();
  /*useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
  
      setProviders(res);
    };
  
    setAuthProviders();
  }, []);
const SignInButtons=()=>{
if (providers){
return Object.values(providers).map((provider) => (
  <button
  key={provider.id}  
  onClick={() => signIn(provider?.id)}
    class='flex items-center space-x-2 focus:outline-none'
  >
    <FaGoogle class='text-red-500' />
    <span class='text-white font-semibold'>Sign In with {provider.name}</span>
  </button>
));

}

}*/
  
  return (
    <nav class='bg-blue-700 border-b border-blue-500'>
      <div class='container mx-auto flex items-center justify-between'>
        <Link href='/'>
          
            <Image src={logo} alt='logo' width={150} height={50} />

        </Link>
        <div class='hidden md:flex items-center space-x-3'>
          <Link href='/' className='text-white font-semibold'>
            Home
          </Link>
          
          {isLoaded&&isSignedIn? (
            <>
            <div class='relative'>
              <UserButton />
              <Link href={`/budget/${new Date().getMonth() + 1}/${new Date().getFullYear()}`} className='text-white>font-semibold'>Budget</Link>
              
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                class='flex items-center space-x-2 focus:outline-none'
              aria-expanded={isProfileMenuOpen}>
                <Image
                  src={profileDefault}
                  alt='profile'
                  width={30}
                  height={30}
                  class='rounded-full'
                />
                <span class='text-white font-semibold'>
                  {user.fullName}
                </span>
              </button>
              
              {isProfileMenuOpen && (
                <div class='absolute top-12 right-0 bg-white p-3 shadow-lg rounded-md'>
                  <button
                    onClick={() => signOut()}
                    class='flex items-center space-x-3 focus:outline-none'
                  >
                    <FaGoogle class='text-red-500' />
                    <span class='text-red-500 font-semibold'>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
              ) : (<div><SignInButton/></div>)
          }
        </div>
</div>
</nav>
  );
};
export default Navbar;
