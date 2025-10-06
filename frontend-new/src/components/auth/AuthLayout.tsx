'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  isLogin?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  isLogin = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
            <span className="text-white text-2xl font-bold">BS</span>
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">
            {title}
          </h2>
          <p className="text-black">
            {subtitle}
          </p>
        </div>
        
        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
          {children}
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-black">
            © 2024 BUDDY-SCRIPT. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
