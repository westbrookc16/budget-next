'use client';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo-white.png';
import profileDefault from '@/assets/images/profile.png';
import { FaGoogle } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import styles from '@/css/styles.module.css';
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
    className='flex items-center space-x-2 focus:outline-none'
  >
    <FaGoogle className='text-red-500' />
    <span className='text-white font-semibold'>Sign In with {provider.name}</span>
  </button>
));

}

}*/

  // console.log(isLoaded, isSignedIn);

  return (
    <div>
      <div className={styles.navContainer}>
        <div className={styles.navWrapper}>
          <div className={styles.navLeft}>
            <div className={styles.navLeftLinks}>
              <Link href='/' className={styles.navLeftLink}>
                <Image
                  src={logo}
                  alt='logo'
                  width={45}
                  height={45}
                  className={styles.logo}
                />
              </Link>
            </div>
          </div>
          <div className={styles.navMiddle}></div>
          <div className={styles.navRight}>
            <div className={styles.navRightLinks}>
              <Link href='/' className={styles.homeLink}>
                Home
              </Link>
              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    href={`/budget/${
                      new Date().getMonth() + 1
                    }/${new Date().getFullYear()}`}
                    className={styles.link}
                  >
                    Budget
                  </Link>
                  <div className={styles.link}>
                    <UserButton />
                  </div>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={styles.btn}
                    aria-expanded={isProfileMenuOpen}
                  >
                    <Image
                      src={profileDefault}
                      alt='profile'
                      width={30}
                      height={30}
                      className='rounded-full mr-2'
                    />
                    <span
                      style={{ fontSize: 15 }}
                      className='hidden text-white mt-1 lg:block'
                    >
                      {/* {user.fullName} */}
                      username
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className={styles.btn}>
                      <button
                        // onClick={() => signOut()}
                        className={styles.btnInside}
                      >
                        <FaGoogle className='text-white' />
                        <span className='text-white font-semibold'>
                          Sign Out
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <SignInButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
