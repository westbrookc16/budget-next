"use client";
import * as sentry from "@sentry/nextjs";

import prisma from "@/utils/prisma";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";
import profileDefault from "@/assets/images/profile.png";
import { FaGoogle } from "react-icons/fa";
import { useUser, useSession } from "@clerk/nextjs";
import styles from "@/css/styles.module.css";
import { useGlobalState } from "./globalState";
const Navbar = () => {
  const [portalLink, setPortalLink] = useState<string>("");
  const [providers, setProviders] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const { session } = useSession();
  //

  const subscriptionStatus = useGlobalState(
    (state) => state.subscriptionStatus
  );
  const setSubscriptionStatus = useGlobalState(
    (state) => state.setSubscriptionStatus
  );
  const customerId = useGlobalState((state) => state.customerId);
  const setCustomerId = useGlobalState((state) => state.setCustomerId);
  useEffect(() => {
    function getSubscriptionStatus() {
      console.log(`isSignedIn=${isSignedIn}`);
      if (!isSignedIn) {
        setSubscriptionStatus("");
        return;
      }

      setSubscriptionStatus(
        //@ts-ignore
        user?.publicMetadata?.stripe?.subscriptionStatus as string
      );
    }
    getSubscriptionStatus();
  }, [user, setSubscriptionStatus, setCustomerId, isSignedIn]);
  useEffect(() => {
    async function getPortalLink() {
      if (!isSignedIn) {
        return;
      }
      const link = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/create-portal-link/${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );
      if (!link.ok) {
        console.error("Error getting portal link");
        setPortalLink("");
        return;
      }
      const data = await link.json();
      setPortalLink(data.url);
    }
    getPortalLink();
  }, [user?.id, isSignedIn]);
  return (
    <div>
      <div className={styles.navContainer}>
        <div className={styles.navWrapper}>
          <div className={styles.navLeft}>
            <div className={styles.navLeftLinks}>
              <Link href="/" className={styles.navLeftLink}>
                <Image
                  src={logo}
                  alt="logo"
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
              <Link href="/" className={styles.homeLink}>
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
                    {(subscriptionStatus === "active" ||
                      (subscriptionStatus === "trialing" && isSignedIn)) && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}api/create-portal-link/${user.id}`}
                        className={styles.link}
                      >
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
