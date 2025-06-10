import { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300 p-6 flex items-center justify-center">
      <div className="container text-center">
        {/* 404 Image/Text */}
        <div className="relative mx-auto mb-7.5 max-w-[500px] text-center lg:mb-12.5">
          <h1 className="font-heading-1 text-heading-1 mb-5 text-dark">404</h1>
          <svg className="mx-auto mb-10 w-full max-w-[400px]" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            {/* Background Elements */}
            <circle cx="400" cy="200" r="150" fill="#E1E8FF" opacity="0.5" />
            <path d="M300,250 Q400,150 500,250" stroke="#3C50E0" strokeWidth="8" fill="none" />

            {/* Broken Link Icon */}
            <g transform="translate(350,170)">
              <path d="M40,20 L60,20 A20,20 0 1,1 60,60 L40,60" stroke="#1C274C" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M60,20 L40,20 A20,20 0 1,0 40,60 L60,60" stroke="#3C50E0" strokeWidth="8" fill="none" strokeLinecap="round" />
            </g>

            {/* Decorative Elements */}
            <circle cx="300" cy="150" r="10" fill="#ADBCF2" />
            <circle cx="500" cy="250" r="8" fill="#5475E5" />
            <circle cx="450" cy="150" r="6" fill="#C3CEF6" />
            <circle cx="350" cy="280" r="7" fill="#8099EC" />

            {/* Text Elements */}
            <text x="400" y="320" textAnchor="middle" fill="#1C274C" fontSize="24" fontFamily="sans-serif">
              Page Not Found
            </text>
          </svg>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-[546px]">
          <h2 className="mb-4 text-heading-4 font-medium text-dark">Page Not Found</h2>
          <p className="mb-7.5 text-lg text-dark-3">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Back to Home Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 px-7 py-3 text-base font-medium transition duration-300 ease-in-out hover:bg-blue-dark"
          >
            Back to SkipSizePage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
