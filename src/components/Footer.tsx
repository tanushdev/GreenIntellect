
import React from 'react';
import { Mail, MapPin, Phone, X, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg px-0 py-0">
                <img 
                  src="/lovable-uploads/bf7058c8-a45c-4d86-aaef-6aeb598b4167.png" 
                  alt="GreenIntellect Logo" 
                  className="h-20 w-20 object-contain" 
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  GreenIntellect
                </h3>
                <p className="text-slate-400 text-sm font-medium">Greenwashing Detection Platform</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-8 max-w-lg leading-relaxed text-base">
              Empowering businesses with comprehensive analytics and insights. Detect greenwashing, track environmental performance, and make data-driven sustainability decisions with our advanced model platform.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://x.com/Tanush7875" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/25 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/tanushshyam/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/25 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/demonconfig" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-3 rounded-full hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/25 hover:scale-110"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-emerald-400">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="bg-emerald-600/20 p-2 rounded-lg group-hover:bg-emerald-600/30 transition-colors duration-200">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Email</p>
                  <span className="text-slate-300 text-sm hover:text-emerald-400 transition-colors duration-200 cursor-pointer">
                    tanushshyam32@gmail.com
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="bg-emerald-600/20 p-2 rounded-lg group-hover:bg-emerald-600/30 transition-colors duration-200">
                  <Phone className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Phone</p>
                  <span className="text-slate-300 text-sm hover:text-emerald-400 transition-colors duration-200 cursor-pointer">
                    +91 8806607771
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="bg-emerald-600/20 p-2 rounded-lg group-hover:bg-emerald-600/30 transition-colors duration-200">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Location</p>
                  <span className="text-slate-300 text-sm">Panvel, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-slate-400 text-sm">© 2025 GreenIntellect. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
