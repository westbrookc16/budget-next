'use client';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo-white.png';
import { useUser } from '@clerk/nextjs';
import styles from '@/css/styles.module.css';
import { Fade as Hamburger } from 'hamburger-react';

import CheckoutButton from './stripe-payment';
import { useState } from 'react';

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const subscriptionStatus = user?.publicMetadata?.stripe?.subscriptionStatus;

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);

    console.log(isNavOpen);
  };
  return (
    <div>
      <div
        className={isNavOpen ? styles.navContainerMobile : styles.navContainer}
      >
        <div className={styles.navWrapper}>
          <div className={isNavOpen ? styles.navLeftMobile : styles.navLeft}>
            <div
              className={
                isNavOpen ? styles.navLeftLinksMobile : styles.navLeftLinks
              }
            >
              <Link href='/' className={styles.navLeftLink}>
                <Image
                  src={logo}
                  alt='Budget Management Home Logo'
                  width={45}
                  height={45}
                  className={styles.logo}
                />
              </Link>
            </div>
          </div>
          <div className={styles.navMiddle}></div>
          <div className={styles.navRight}>
            <div
              className={
                isNavOpen ? styles.navRightLinksMobile : styles.navRightLinks
              }
            >
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
                    Budget Management
                  </Link>
                  {(subscriptionStatus === 'active' ||
                    subscriptionStatus === 'trialing') &&
                    isSignedIn && (
                      <>
                        <div className={styles.link}>
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}api/create-portal-link/${user.id}`}
                            className={styles.link}
                          >
                            Manage Subscription
                          </Link>
                        </div>
                      </>
                    )}
                  <div className={styles.linkSub}>
                    {(subscriptionStatus === 'none' ||
                      subscriptionStatus === '' ||
                      !subscriptionStatus) &&
                      isSignedIn && <CheckoutButton />}
                  </div>
                  <div className={styles.link}>
                    <Link href='/contact'>Contact</Link>
                  </div>
                  <div className={styles.link}>
                    <SignOutButton />
                  </div>
                </>
              ) : (
                <div className={styles.link}>
                  <SignInButton />
                </div>
              )}
            </div>
          </div>

          <div className={isNavOpen ? styles.burgerMobile : styles.burger}>
            <Hamburger
              color='#fff'
              size={25}
              toggle={toggleNav}
              toggled={isNavOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
