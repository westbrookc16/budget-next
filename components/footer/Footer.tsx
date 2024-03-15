'use client';

import styles from '@/css/footer.module.css';
import { useUser } from '@clerk/nextjs';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { subscriptionStatusAtom } from '@/types/atoms';
import CheckoutButton from '../stripe-payment';

const Footer = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [subscriptionStatus, setSubscriptionStatus] = useAtom(
    subscriptionStatusAtom
  );

  useEffect(() => {
    function getSubscriptionStatus() {
      if (!isSignedIn) {
        setSubscriptionStatus('');
        return;
      }

      setSubscriptionStatus(
        user?.publicMetadata?.stripe?.subscriptionStatus as string
      );
    }
    getSubscriptionStatus();
  }, [user, setSubscriptionStatus, isSignedIn]);

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__copyright}>
        <small className={styles.small}>
          &copy;2024 Chris WestBrook. All rights reserved.
        </small>
        {isLoaded && isSignedIn && (
          <div className={styles.link}>
            {(subscriptionStatus === 'none' ||
              subscriptionStatus === '' ||
              !subscriptionStatus) &&
              isSignedIn && <CheckoutButton />}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
