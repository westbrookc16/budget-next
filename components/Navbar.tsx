'use client';
import { useAuth } from '@clerk/nextjs';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo-white.png';
import { useUser } from '@clerk/nextjs';
import styles from '@/css/styles.module.css';
import { useGlobalState } from './globalState';

const selectedEnv =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL;

const Navbar = () => {
  const [portalLink, setPortalLink] = useState<string>('');
  const [providers, setProviders] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();

  // console.log(isLoaded, isSignedIn);
  const { userId } = useAuth();
  const subscriptionStatus = useGlobalState(
    (state) => state.subscriptionStatus
  );
  const setSubscriptionStatus = useGlobalState(
    (state) => state.setSubscriptionStatus
  );
  const customerId = useGlobalState((state) => state.customerId);
  const setCustomerId = useGlobalState((state) => state.setCustomerId);
  useEffect(() => {
    async function getSubscriptionStatus() {
      if (!userId) {
        setSubscriptionStatus('');
        return;
      }
      const res = await fetch(
        `${selectedEnv}api/users/getSubscriptionStatus/${userId}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.dir(res);
      const data = await res.json();
      setSubscriptionStatus(data?.subscriptionStatus);
      setCustomerId(data?.customerId);
      //console.log(data.subscriptionStatus);
    }
    getSubscriptionStatus();
  }, [userId, setSubscriptionStatus, setCustomerId]);
  useEffect(() => {
    async function getPortalLink() {
      if (!customerId) {
        return;
      }
      const link = await fetch(
        `${selectedEnv}api/create-portal-link/${customerId}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`customerId: ${customerId}`);
      const data = await link.json();
      setPortalLink(data.url);
    }
    getPortalLink();
  }, [customerId]);
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
                    Budget Management
                  </Link>
                  <div className={styles.link}>
                    <SignOutButton />
                    {(subscriptionStatus === 'active' ||
                      subscriptionStatus === 'trialing') && (
                      <Link href={portalLink} className={styles.link}>
                        Manage Subscription
                      </Link>
                    )}
                  </div>
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
