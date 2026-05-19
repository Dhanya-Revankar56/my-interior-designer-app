import React from 'react';

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-[#caa74a] to-[#8f6b10] text-white grid place-items-center font-bold">ID</div>
              <span className="font-['Playfair_Display'] text-gray-900 font-semibold">Interior Designer</span>
            </div>
            <p className="text-gray-600">Plan spaces, visualize layouts, and refine your design ideas.</p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="/about" className="hover:text-[#caa74a]">About</a></li>
              <li><a href="#" className="hover:text-[#caa74a]">Careers</a></li>
              <li><a href="#" className="hover:text-[#caa74a]">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Resources</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-[#caa74a]">Docs</a></li>
              <li><a href="#" className="hover:text-[#caa74a]">Blog</a></li>
              <li><a href="#" className="hover:text-[#caa74a]">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Follow</h4>
            <div className="flex gap-4 text-gray-600">
              <a href="#" aria-label="X / Twitter" className="hover:text-[#caa74a]" title="X / Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M13.943 10.603 21.3 3h-1.742l-6.386 6.731L7.77 3H2l7.702 11.01L2 21h1.742l6.705-7.066L16.23 21H22l-8.057-10.397Zm-2.376 2.505-.777-1.113-6.18-8.846h2.662l4.991 7.145.777 1.113 6.51 9.315h-2.662l-5.321-7.614Z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[#caa74a]" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-3a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z"/>
                </svg>
              </a>
              <a href="#" aria-label="Dribbble" className="hover:text-[#caa74a]" title="Dribbble">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm6.73 6.62a7.91 7.91 0 0 1 1.599 4.295 18.21 18.21 0 0 0-5.53-.254 24.74 24.74 0 0 0-.754-1.64 24.15 24.15 0 0 0 4.685-2.401ZM12 4.09a7.91 7.91 0 0 1 5.097 1.843 22.65 22.65 0 0 1-4.384 2.25A30.1 30.1 0 0 0 10.6 5a8 8 0 0 1 1.4-.91ZM8.9 5.9a28.54 28.54 0 0 1 1.95 3.064 24.48 24.48 0 0 1-6.08.78A7.95 7.95 0 0 1 8.9 5.9Zm-4.89 6.1q.0.245.02.49a7.91 7.91 0 0 0 6.79 7.89 17.16 17.16 0 0 0-1.38-6.54 25.42 25.42 0 0 1-5.43 1.38ZM12 19.91a7.88 7.88 0  1-4.27-1.25 15.13 15.13 0 0 1 4.75-1.84 15.34 15.34 0 0 1 2.85-.11A14.9 14.9 0 0 1 12 19.91Zm3.77-3.12a17.08 17.08 0 0 0-3.64.15 18.77 18.77 0 0 0-5.3 1.83 7.91 7.91 0  0 0 10.33-.36 12.64 12.64 0 0 0-1.39-1.62ZM8.38 12.1a26.84 26.84 0 0 0 1.63 5.53 20.64 20.64 0 0 1 3.53-.2 20.33 20.33 0 0 1 4.08.38A7.91 7.91 0 0 0 5.4 9.7a22.52 22.52 0 0 0 2.98-.36Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-600 space-y-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} AI Interior Designer. All rights reserved.</p>
            <div className="space-x-4">
              <a href="#" className="hover:text-[#caa74a]">Privacy</a>
              <a href="#" className="hover:text-[#caa74a]">Terms</a>
              <a href="#" className="hover:text-[#caa74a]">Cookies</a>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <span>Created with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>by</span>
              <span className="font-semibold text-transparent bg-gradient-to-r from-[#caa74a] to-[#9a7a2f] bg-clip-text">
                AYESHA,DHANYA,RAHIL,NANDI
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
