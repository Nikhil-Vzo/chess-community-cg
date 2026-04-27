import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-dark pt-24 pb-8 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Giant Logo Text */}
        <div className="overflow-hidden mb-16">
          <h2 className="font-display text-[7vw] md:text-[6vw] font-bold text-white/[0.03] uppercase leading-none text-center whitespace-nowrap select-none">
            CHESS COMMUNITY CHHATTISGARH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white uppercase mb-4">
              Chess Community Chhattisgarh
            </h3>
            <p className="text-white/40 font-body text-sm leading-relaxed mb-6">
              Elite chess training camps and tournaments. Forging the next generation of Grandmasters since 2015.
            </p>
            <div className="flex items-center gap-4 text-white/40">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-body">info@chesscommunitycg.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/40 mt-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-body">+91 98765 43210</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold text-white uppercase mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Events', href: '/events' },
                { label: 'Videos', href: '/videos' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/40 hover:text-neon transition-colors font-body text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-display text-lg font-bold text-white uppercase mb-4">
              Events
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Summer Camps', href: '/events?tab=camps' },
                { label: 'Tournaments', href: '/events?tab=tournaments' },
                { label: 'Past Events', href: '/events?tab=past' },
                { label: 'Register Now', href: '/events' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/40 hover:text-neon transition-colors font-body text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-display text-lg font-bold text-white uppercase mb-4">
              Visit Us
            </h4>
            <div className="flex items-start gap-3 text-white/40">
              <MapPin className="w-4 h-4 mt-1 shrink-0" />
              <p className="text-sm font-body leading-relaxed">
                Chess Community Chhattisgarh<br />
                Raipur<br />
                Chhattisgarh<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-body">
            &copy; 2026 Chess Community Chhattisgarh. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/30 text-xs font-body hover:text-white/50 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-white/30 text-xs font-body hover:text-white/50 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
