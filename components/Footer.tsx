import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">MEAUXBILITY</h3>
            <p className="text-gray-300 text-sm">
              Providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana's Acadiana region.
            </p>
            <p className="text-gray-400 text-xs mt-4">
              501(c)(3) Nonprofit Organization<br />
              EIN: 33-4214907
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Apply for Grant
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="mailto:contact@meauxbility.org" className="hover:text-white transition-colors">
                  contact@meauxbility.org
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Meauxbility. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
