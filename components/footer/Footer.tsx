"use client";
import { useEffect, useState } from "react";
import { getSubscriptionStatus } from "@/app/actions/user";
import styles from "@/css/footer.module.css";

import CheckoutButton from "../stripe-payment";
import { createClient } from "@/utils/supabase/client";

const Footer = () => {
  //const { isLoaded, isSignedIn, user } = useUser();

  const [subscriptionStatus, setSubscriptionStatus] = useState<
    string | Response
  >("none");
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      const status = await getSubscriptionStatus();
      setSubscriptionStatus(status || "none");
    }
    fetchSubscriptionStatus();
  }, []);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  useEffect(() => {
    async function fetchSignedInStatus() {
      const supabase = createClient();
      const { user } = (await supabase.auth.getUser()).data;

      if (user) {
        console.log(`isSignedIn=true`);
        setIsSignedIn(true);
      }
    }
    fetchSignedInStatus();
  }, []);
  const isLoaded = true;
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__copyright}>
        <small className={styles.small}>
          &copy;2024 Chris WestBrook. All rights reserved.
        </small>
        {isLoaded && isSignedIn && subscriptionStatus === "none" && (
          <div className={styles.link}>
            {(subscriptionStatus === "none" ||
              subscriptionStatus === "" ||
              subscriptionStatus === "canceled" ||
              !subscriptionStatus) &&
              isSignedIn && <CheckoutButton />}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
