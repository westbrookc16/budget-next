"use client";
import SignOutButton from "./signOutButton";
import SignInButton from "./SignInButton";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";

import styles from "@/css/styles.module.css";
import { Fade as Hamburger } from "hamburger-react";

import CheckoutButton from "./stripe-payment";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
const Navbar = ({ userProp }: { userProp: string }) => {
  const [user, setUser] = useState<string>(userProp);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();

      const { data: subscriptionStatus, error: subscriptionError } =
        await supabase.from("user_data").select("subscription_status").single();
      if (subscriptionStatus) {
        setSubscriptionStatus(
          subscriptionStatus?.subscription_status ?? "none"
        );
      } else setSubscriptionStatus("none");
    }
    fetchUser();
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const sub = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(false);
      if (event !== "SIGNED_OUT") setUser(session?.user?.id ?? userProp);
      else setUser("");
    });
    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [userProp]);
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);

    console.log(isNavOpen);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

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
              <Link href="/" className={styles.navLeftLink}>
                <Image
                  src={logo}
                  alt="Budget Management Home Logo"
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
              <Link href="/" className={styles.homeLink}>
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    href={`/budget/${
                      new Date().getMonth() + 1
                    }/${new Date().getFullYear()}`}
                    className={styles.link}
                  >
                    Budget Management
                  </Link>
                  {(subscriptionStatus === "active" ||
                    subscriptionStatus === "trialing") &&
                    user && (
                      <>
                        <div className={styles.link}>
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}api/create-portal-link/${user}`}
                            className={styles.link}
                          >
                            Manage Subscription
                          </Link>
                        </div>
                      </>
                    )}
                  <div className={styles.linkSub}>
                    {(subscriptionStatus === "none" ||
                      subscriptionStatus === "" ||
                      subscriptionStatus === "canceled" ||
                      !subscriptionStatus) &&
                      user && <CheckoutButton />}
                  </div>
                  <div className={styles.link}>
                    <Link href="/contact">Contact</Link>
                  </div>
                  <div className={styles.link}>
                    <SignOutButton />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.link}>
                    <Link href="/login">Login</Link>
                  </div>
                  <div className={styles.link}>
                    <Link href="/signup">SignUp</Link>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={isNavOpen ? styles.burgerMobile : styles.burger}>
            <Hamburger
              color="#fff"
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
