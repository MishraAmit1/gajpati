import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";
import logo from "../../public/logo-footer-removebg-preview.webp"
export const Footer = () => {
  return (
    <footer className="bg-eerie-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Gajpati Industries Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              India's premium manufacturer of infrastructure chemicals.
              Trusted by engineers nationwide for quality and reliability.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/gajpati-industries-india/"> <Linkedin className="h-5 w-5 text-gray-400 hover:text-amber cursor-pointer" /></a>
              <a href="https://x.com/"> <Twitter className="h-5 w-5 text-gray-400 hover:text-amber cursor-pointer" /></a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-amber text-sm">
                About Us
              </Link>
              <Link to="/products" className="block text-gray-300 hover:text-amber text-sm">
                Products
              </Link>
              <Link to="/blog" className="block text-gray-300 hover:text-amber text-sm">
                Infrastructure Insights
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Products</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>BITMIX Bitumen Solutions</p>
              <p>GABION Gabions & Rockfall Systems</p>
              <p>BONDLITE Epoxy Systems</p>
              <p>SEALMAX Sealants</p>
              <p>MIXWELL Admixtures</p>
              <p>CUREMIX Curing Compounds</p>
              <p>PROOFEX Waterproofing</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber" />
                <span className="text-gray-300 text-sm">+91 95283 55555</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber" />
                <span className="text-gray-300 text-sm">info@gajpatiindustries.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-amber mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Near Power Grid, SIDCO IGC Phase III<br />
                  Samba, Jammu,J&K 184121
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 <a href="https://flauraa.com" target="__blank">Flauraa</a>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy">
              <span className="text-gray-400 text-sm hover:text-amber cursor-pointer">Cookies Policy</span>
            </Link>
            <Link to="/terms-of-service">
              <span className="text-gray-400 text-sm hover:text-amber cursor-pointer">Terms of Service</span>
            </Link>
            <span className="text-gray-400 text-sm hover:text-amber cursor-pointer">ISO / BIS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};