import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import About from './pages/About';
import Login from './pages/Login';
import DemoLogin from './pages/DemoLogin';
import Design from './pages/Design';
import Panorama from './pages/Panorama';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 md:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 min-w-0 flex flex-col font-[Inter]">
          <Header onMenuClick={() => setIsSidebarOpen((v) => !v)} />

          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:id" element={<RoomDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/demo" element={<DemoLogin />} />
                <Route path="/panorama" element={<Panorama />} />
                <Route
                  path="/design"
                  element={
                    <ProtectedRoute>
                      <Design />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
