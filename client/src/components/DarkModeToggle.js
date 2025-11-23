// client/src/components/DarkModeToggle.js
import React, { useState, useEffect } from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme_pref');
    // eslint-disable-next-line no-unused-vars
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default to dark if no preference is saved, or if saved is 'dark'
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : false;
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    updateTheme(newTheme);
    localStorage.setItem('theme_pref', newTheme ? 'dark' : 'light');
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`toggle-icon ${isDark ? 'dark' : 'light'}`}>
        {isDark ? (
          <svg
            className="moon-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
          </svg>
        ) : (
          <svg
            className="sun-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12,1V3M12,21V23M4.22,4.22l1.42,1.42M18.36,18.36l1.42,1.42M1,12H3M21,12h2M4.22,19.78l1.42-1.42M18.36,5.64l1.42-1.42" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
