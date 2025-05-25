import React, { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../SideBar/SideBar';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';
import {
  faStethoscope,
  faCross,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Layout = () => {
  const [navHeight, setNavHeight] = useState(0);
  const [navMobileHeight, setNavMobileHeight] = useState(0);
  const navRef = useRef(null);
  const mobNavRef = useRef(null);
  const sidebarRef = useRef(null); // Ref for sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const [healthCheckForm, setHealthCheckForm] = useState(false);
  const {showSideBar, setShowSideBar, toggleSideBar} = useAuth();
  const [inputStatus, setInputStatus] = useState(Array(12).fill(false));
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [viewingDistance, setViewingDistance] = useState(0);
  const [deviceUsed, setDeviceUsed] = useState('Smartphone');
  const [videoBrightness, setVideoBrightness] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sleepSchedule, setSleepSchedule] = useState(0);
  const [headache, setHeadache] = useState('No');
  const [healthScore, setHealthScore] = useState(null);

  const handleNext = (index) => {
    setInputStatus((prev) => {
      const updated = [...prev];
      updated[index] = false;
      updated[index + 1] = true;
      return updated;
    });
  };

  const handlePrev = (index) => {
    setInputStatus((prev) => {
      const updated = [...prev];
      updated[index] = false;
      updated[index - 1] = true;
      return updated;
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(`https://health-score-qy4x.onrender.com/predictHealthScore`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Age: age,
          Gender: gender,
          Height: height,
          Weight: weight,
          ScreenTime: screenTime,
          ViewingDistance: viewingDistance,
          DeviceUsed: deviceUsed,
          VideoBrightness: videoBrightness,
          AudioLevel: audioLevel,
          SleepSchedule: sleepSchedule,
          Headache: headache
        }),
      });
      if(response.ok){
        const output = await response.json();
        setHealthScore(output);
    setInputStatus((prev) => {
      const updated = [...prev];
      updated[11] = false;
      return updated;
    })
      }
    }catch(error){
      console.log(error);
    }
  }

  const openHealthCheckForm = () => {
    setHealthCheckForm(true);
    inputStatus[0] = true;
  }
  const closeHealthCheckForm = (index) => {
    setHealthCheckForm(false);
    setInputStatus(Array(12).fill(false));
  }

  useEffect(() => {
    setShowSideBar(false);
  }, [location.pathname])


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
        setShowSideBar(false);
      }
    };

    if (showSideBar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSideBar]);

  return (
    <div>
    {isMobile && (
          <>
      {/* Navbar always visible */}
      <div ref={mobNavRef} className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Sidebar overlay on top */}
      {showSideBar && (
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
    )}
    {!isMobile && (
      <>
  <div ref={navRef} className="fixed top-0 left-0 w-full z-50">
    <Navbar />
  </div>

  <div className="flex bg-black">
    {/* Fixed Sidebar */}
    <div
      className="fixed left-0 w-64 z-40"
      style={{
        top: `${navHeight}px`,
        height: `calc(100vh - ${navHeight}px)`
      }}
    >
      <Sidebar />
    </div>

    {/* Main Content */}
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
    )}
  <div className={`fixed bottom-6 right-6 z-50 ${healthCheckForm ? "hidden" : ""}`}>
    <button
      onClick={openHealthCheckForm} // Replace with navigation or modal open logic
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-full shadow-lg transition duration-300"
    >
      Get a Quick Health Check
      <FontAwesomeIcon icon={faStethoscope} className='ml-2'/>
    </button>
  </div>
{healthCheckForm && (
  <div className="fixed bottom-4 right-4 z-50 w-[90%] max-w-md sm:w-[28rem] bg-white text-gray-900 p-2 md:p-4 rounded-2xl shadow-2xl border border-gray-200 space-y-6">
    <FontAwesomeIcon icon={faTimes} className='absolute right-4 top-4 rounded-bl-lg font-bold' onClick={closeHealthCheckForm}/>
    <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
      Health Check for <span className="text-indigo-600 font-bold">Viewtube</span>
    </h2>

    {inputStatus.map((status, index) => (
      status && index<11 && (
        <div key={index} className="space-y-2">
          {(() => {
            const labelMap = [
              "Age", "Gender", "Height (cm)", "Weight (kg)",
              "Screen Time (hrs/day)", "Viewing Distance (cm)", "Device Used",
              "Video Brightness (1–10)", "Audio Level (1–10)", "Sleep Schedule (hrs)", "Headache"
            ];

            const inputField = () => {
              if (index === 1 || index === 6 || index === 10) {
                const options = {
                  1: ["Male", "Female"],
                  6: ["Smartphone", "Tablet", "Laptop", "Desktop", "TV"],
                  10: ["No", "Minor", "Major"]
                }[index];

                return (
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={
                      [gender, deviceUsed, headache][[1, 6, 10].indexOf(index)]
                    }
                    onChange={(e) => {
                      const setters = [setGender, setDeviceUsed, setHeadache];
                      setters[[1, 6, 10].indexOf(index)](e.target.value);
                    }}
                  >
                    {options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                );
              } else {
                const values = [
                  age, height, weight, screenTime,
                  viewingDistance, videoBrightness,
                  audioLevel, sleepSchedule
                ];

                const setters = [
                  setAge, setHeight, setWeight, setScreenTime,
                  setViewingDistance, setVideoBrightness,
                  setAudioLevel, setSleepSchedule
                ];

                return (
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={values[index === 0 ? 0 : index - (index > 1 ? 1 : 0)]}
                    onChange={(e) => setters[index === 0 ? 0 : index - (index > 1 ? 1 : 0)](e.target.value)}
                  />
                );
              }
            };

            return (
              <>
                <label className="block font-medium text-gray-700">
                  {labelMap[index]}
                </label>
                {inputField()}
                <div className="flex justify-between pt-2">
                  {index > 0 && (
                    <button
                      className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                      onClick={() => handlePrev(index)}
                    >
                      Prev
                    </button>
                  )}
                  {index < inputStatus.length - 1 && (
                    <button
                      className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                      onClick={() => handleNext(index)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )
    ))}

    {inputStatus[11] && (
      <div className="space-y-2">
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Submit
        </button>
        <button
          className="w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          onClick={() => handlePrev(11)}
        >
          Prev
        </button>
      </div>
    )}

    {healthScore && (
      <div className="bg-indigo-50 text-indigo-900 p-4 rounded-lg mt-4 space-y-1 border border-indigo-200">
        <p className="font-semibold">Health Score: {healthScore.PredictedHealthScore}</p>
        <p className="text-sm">{healthScore.Interpretation}</p>
      </div>
    )}
  </div>
)}

  </div>
  );
};

export default Layout;
