"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  function isExactActive(pathname: string, url?: string) {
    if (!url) return false;

    return pathname === url || pathname.startsWith(url + "/");
  }

  function getBestMatch(pathname: string, urls: string[]) {
    return urls
      .filter((url) => isExactActive(pathname, url))
      .sort((a, b) => b.length - a.length)[0]; // longest match
  }

  useEffect(() => {
    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        const subUrls = item.items?.map((i) => i.url) || [];

        const bestMatch = getBestMatch(pathname, subUrls);

        if (bestMatch && !expandedItems.includes(item.title)) {
          setExpandedItems([item.title]);
        }
      });
    });
  }, [pathname]);

  useEffect(() => {
    let found = false;

    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        const isMatch = item.items?.some(
          (subItem: any) =>
            pathname === subItem.url || pathname.startsWith(subItem.url + "/"),
        );

        if (isMatch) {
          setExpandedItems([item.title]); // ✅ only one open
          found = true;
        }
      });
    });

    // 👉 If no match → close all dropdowns
    if (!found) {
      setExpandedItems([]);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10">
          <div className="relative flex justify-center border-b border-gray-300 pb-1.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pl-[25px] pr-[7px] min-[850px]:mt-5">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-4">
                    {section.items.map((item) => {
                      const subUrls =
                        item.items?.map((i) => i.url).filter(Boolean) || [];

                      const bestMatch = getBestMatch(pathname, subUrls);

                      const isActive = !!bestMatch;
                      return (
                        <li key={item.title}>
                          {item.items.length ? (
                            <div>
                              <MenuItem
                                isActive={item.items.some(({ url }) =>
                                  pathname.startsWith(url),
                                )}
                                className="bg-[#00858A] text-white"
                                onClick={() => toggleExpanded(item.title)}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span
                                  className={`${isActive ? "bg-[#00858A] text-white shadow-sm" : "font-bold text-black"}`}
                                >
                                  {item.title}
                                </span>

                                <ChevronUp
                                  className={cn(
                                    "ml-auto rotate-180 transition-transform duration-200",
                                    expandedItems.includes(item.title) &&
                                      "rotate-0",
                                  )}
                                  aria-hidden="true"
                                />
                              </MenuItem>

                              {expandedItems.includes(item.title) && (
                                <ul
                                  className="ml-8 mr-0 space-y-3 pb-[15px] pr-0 pt-2"
                                  role="menu"
                                >
                                  {item.items.map((subItem: any) => (
                                    <li key={subItem.title} role="none">
                                      <MenuItem
                                        as="link"
                                        href={subItem.url}
                                        isActive={
                                          pathname === subItem.url ||
                                          pathname.startsWith(subItem.url + "/")
                                        }
                                        className="flex p-2"
                                      >
                                        <subItem.icon
                                          className="size-6 shrink-0"
                                          aria-hidden="true"
                                        />

                                        <span>{subItem.title}</span>
                                      </MenuItem>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            (() => {
                              const href = (("url" in item) as any)
                                ? item.url + ""
                                : "/" +
                                  item.title.toLowerCase().split(" ").join("-");

                              const isActive = !!(
                                (item.url && pathname.startsWith(item.url)) ||
                                (item.items?.length &&
                                  item.items.some(
                                    ({ url }) =>
                                      url &&
                                      (pathname === url ||
                                        pathname.startsWith(url + "/")),
                                  ))
                              );

                              return (
                                <MenuItem
                                  as="link"
                                  href={href}
                                  isActive={isActive}
                                  className={cn(
                                    "flex items-center gap-3 py-3 transition-all",
                                  )}
                                >
                                  <item.icon
                                    className="size-6 shrink-0 text-inherit"
                                    aria-hidden="true"
                                  />

                                  <span>{item.title}</span>
                                </MenuItem>
                              );
                            })()
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
