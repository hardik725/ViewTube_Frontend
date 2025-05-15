import React, { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../SideBar/SideBar';

const Layout = () => {
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setNavHeight(rect.height);
    }
  }, []);

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
};

export default Layout;
