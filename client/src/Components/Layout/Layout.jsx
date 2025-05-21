import React, { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../SideBar/SideBar';


const Layout = () => {
  const [navHeight, setNavHeight] = useState(0);
  const [navMobileHeight, setNavMobileHeight] = useState(0);
  const navRef = useRef(null);
  const mobNavRef = useRef(null);
  const sidebarRef = useRef(null); // Ref for sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const toggleSideBar = () => {
      setShowSidebar(prev => !prev);
    }
    window.addEventListener('toggleSideBar',toggleSideBar);

    return () => {
      window.removeEventListener('toggleSideBar',toggleSideBar);
    }
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);  

  useEffect(() => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setNavHeight(rect.height);
    }
  }, []);
    useEffect(() => {
    if (mobNavRef.current) {
      const rect = mobNavRef.current.getBoundingClientRect();
      setNavMobileHeight(rect.height);
    }
  }, []);

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  if(isMobile){
    return(
    <>
      {/* Navbar always visible */}
      <div ref={mobNavRef} className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Sidebar overlay on top */}
      {showSidebar && (
        <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-[100] shadow-lg transition-transform duration-3000"
        ref={sidebarRef}>
          <Sidebar />
        </div>
      )}

      {/* Content below navbar */}
      <div className="p-2 bg-black min-h-screen z-0"
      style={{
        marginTop: `${navMobileHeight}px`,
  }}>
        <Outlet />
      </div>
    </>
    )
  }else{
  return (
    <>
      {/* Fixed Navbar */}
      <div ref={navRef} className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex bg-black">
        {/* Fixed Sidebar with dynamic top and height */}
        <div
          className="fixed left-0 w-64 z-40"
          style={{
            top: `${navHeight}px`,
            height: `calc(100vh - ${navHeight}px)`
          }}
        >
          <Sidebar />
        </div>

        {/* Main content with margin to avoid overlap */}
<div
  className="ml-64 p-2 w-full bg-black min-h-screen"
  style={{
    marginTop: `${navHeight}px`,
  }}
>
  <Outlet />
</div>

      </div>
    </>
  );
}
};

export default Layout;
