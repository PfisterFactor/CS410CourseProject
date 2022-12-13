import { GetServerSidePropsContext } from "next";
import React, { useEffect, useRef, useState } from "react";
import { IUser } from "../backend/db/schemas/User";
import { GetUserFromLoginToken } from "../backend/login/GetUserFromLoginToken";
import styles from "../styles/components/AppHeader.module.css";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export const AppHeader = (props: any) => {
  const [state, setState] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const navRef: any = useRef<HTMLElement>();

  const navigation = [
    { title: "Scrape a new page", path: "/website-selector" },
    { title: "Manage scraping", path: "/manager" },
  ];

  useEffect(() => {
    const body = document.body;

    // Disable scrolling
    const customBodyStyle = ["overflow-hidden", "lg:overflow-visible"];
    if (state) body.classList.add(...customBodyStyle);
    // Enable scrolling
    else body.classList.remove(...customBodyStyle);

    // Sticky strick
    const customStyle = ["sticky-nav", "fixed", "border-b"];
    window.onscroll = () => {
      if (window.scrollY > 80) navRef.current?.classList?.add(...customStyle);
      else navRef.current?.classList?.remove(...customStyle);
    };
  }, [state]);

  useEffect(() => {
    const loginToken = Cookies.get("LoginToken") ?? null;
    if (loginToken == null) return;
    const decoded: any = jwt.decode(loginToken);
    setLoggedInUser(decoded["email"] ?? null);
  });

  return (
    <nav
      ref={navRef}
      className="bg-slate-100 w-full top-0 z-20 border-b-2 border-slate-500"
    >
      <div className="items-center px-4 max-w-screen-xl mx-auto lg:flex lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-4 lg:block">
          <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-2 -2 24 24"
              width={120}
              height={50}
              fill="currentColor"
            >
              <path d="M3 12a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3zm0-2a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3 3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zm0-8a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zm2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
            </svg>
          </a>
          <div className="lg:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              {state ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-between flex-row-reverse lg:overflow-visible lg:flex lg:pb-0 lg:pr-0 lg:h-auto ${
            state ? "h-screen pb-20 overflow-auto pr-4" : "hidden"
          }`}
        >
          {loggedInUser == null && (
            <div>
              <ul className="flex flex-col-reverse space-x-0 lg:space-x-6 lg:flex-row">
                <li className="mt-4 lg:mt-0">
                  <a
                    href="/login"
                    className="py-3 px-4 text-center border text-gray-600 hover:text-indigo-600 rounded-md block lg:inline lg:border-0"
                  >
                    Login
                  </a>
                </li>
                <li className="mt-8 lg:mt-0">
                  <a
                    href="/signup"
                    className="py-3 px-4 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow block lg:inline"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          )}
          {loggedInUser != null && (
            <div>
            <ul className="flex flex-col-reverse space-x-0 lg:space-x-6 lg:flex-row">
              <li className="mt-4 lg:mt-0">
                <h1><b>{loggedInUser}</b></h1>
              </li>
              <li className="mt-8 lg:mt-0">
                <a
                  href="/signout"
                  className="py-3 px-4 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow block lg:inline"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
          )}
          <div className="flex-1">
            <ul className="justify-center items-center space-y-8 lg:flex lg:space-x-6 lg:space-y-0">
              {navigation.map((item, idx) => {
                return (
                  <li key={idx} className="text-gray-600 hover:text-indigo-600">
                    <a href={item.path}>{item.title}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
