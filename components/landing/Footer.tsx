import React from "react";
import Logo from "../Logo";
import Link from "next/link";

const Footer = () => {
  const footerData = [
    {
      title: "Navigation",
      links: [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contacts", label: "Contacts" },
      ],
      isLinkType: true,
    },
    {
      title: "Contacts",
      links: [
        { label: "+1 (814) 403-6708", href: "tel:+18144036708" },
        { label: "info@xcoldchain.com", href: "mailto:info@xcoldchain.com" },
      ],
      isLinkType: false,
    },
    {
      title: "Socials",
      links: [{ href: "https://linkedin.com", label: "LinkedIn" }],
      isLinkType: true,
    },
  ];
  return (
    <footer className="w-full relative flex flex-col items-center justify-center  md:pt-8 overflow-hidden mt-12 p-6 md:p-0">
      {/* <Image src={landingPageBackground} alt="footer-bg" className=" w-full h-full object-cover object-top" /> */}
      {/* <Logo
        withText={false}
        className="absolute -top-[23%] right-[12%] opacity-20"
        width={500}
        height={500}
      /> */}

      <div className="w-full max-w-7xl flex flex-col h-[70vh]">
        <div
          id="footer-links"
          className="md:w-[50%] w-full flex flex-1 flex-row flex-wrap justify-between gap-10 "
        >
          {footerData.map((section, index) => (
            <div key={index} className="flex flex-col gap-6">
              <h3 className="text-secondary text-md font-medium ">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {section.isLinkType ? (
                      <Link
                        href={link.href}
                        className="text-primary hover:text-tertiary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-white">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h1 className="w-full  text-white text-[6rem] md:text-[14rem]  font-syne md:tracking-[7.2rem] font-bold ">
          AIGEN
        </h1>

        <div className="flex flex-col justify-center gap-4 border-t-[1px] border-secondary h-16">
          <p className="text-secondary text-sm font-medium">
            Copyright © 2025 AIGEN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
