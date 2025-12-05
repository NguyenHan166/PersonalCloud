import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Cloud, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Promo/Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-accent p-12 flex-col justify-between text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Cloud className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold">CloudHan</span>
        </div>

        {/* Main promo content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Your Personal Cloud,<br />
              <span className="text-white/80">Simplified.</span>
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-md">
              Store, organize, and share your files, links, and notes — all in one beautiful place.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Secure by Design</p>
                <p className="text-sm text-white/60">End-to-end encryption for your data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Lightning Fast</p>
                <p className="text-sm text-white/60">Access your content instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Share Anywhere</p>
                <p className="text-sm text-white/60">Public links with custom access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-white/50">
          © 2024 CloudHan. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden p-6 flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-text">CloudHan</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden p-6 text-center text-sm text-muted">
          © 2024 CloudHan. All rights reserved.
        </div>
      </div>
    </div>
  );
};
