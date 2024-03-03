"use client";
import { useAuth } from "@clerk/nextjs";
import prisma from "@/utils/prisma";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";
import profileDefault from "@/assets/images/profile.png";
import { FaGoogle } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import styles from "@/css/styles.module.css";
import { useGlobalState } from "./globalState";
const Navbar = () => {
  const [portalLink, setPortalLink] = useState<string>("");
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
        setSubscriptionStatus("");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/users/getSubscriptionStatus/${userId}`
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
      if (customerId === "") {
        return;
      }
      const link = await fetch(`/api/create-portal-link/${customerId}`);
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
                      subscriptionStatus === "trialing") && (
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
