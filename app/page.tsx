import Link from 'next/link'
import { MessageSquare, Code, Users, CreditCard, FolderOpen } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Empowering Mobility.
            <br />
            Restoring Independence.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Supporting spinal cord injury survivors across Acadiana with grants for adaptive equipment and accessibility services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="btn-glass-primary text-lg"
            >
              Apply for Grant
            </Link>
            <Link
              href="/donate"
              className="btn-glass-secondary text-lg"
            >
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* TRUTEC Stack Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Meauxbility TRUTEC Stack
            </h2>
            <p className="text-xl text-gray-300">
              Our Application, simplified.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Stack Components */}
            <div className="space-y-4">
              <StackCard icon={<MessageSquare />} label="Messages" />
              <StackCard icon={<Code />} label="API" />
              <StackCard icon={<Users />} label="Customers" />
              <StackCard icon={<CreditCard />} label="Brands" />
              <StackCard icon={<FolderOpen />} label="Assets" />
            </div>

            {/* Right Side - App Logo */}
            <div className="flex items-center justify-center">
              <div className="glass-card p-12 text-center">
                <div className="text-3xl font-black tracking-wider">
                  MEA<span className="text-blue-500">UX</span>BILITY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="50+" label="Grants Awarded" />
            <StatCard number="$100K+" label="Equipment Funded" />
            <StatCard number="15+" label="Parishes Served" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Meauxbility is a 501(c)(3) nonprofit organization dedicated to empowering spinal cord injury survivors across Louisiana's Acadiana region. We provide mobility grants and accessibility services to help individuals regain their independence and improve their quality of life.
          </p>
          <div className="mt-8">
            <Link
              href="/about"
              className="btn-glass-primary"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Whether you need assistance or want to support our cause, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="btn-glass-primary text-lg"
            >
              Apply Now
            </Link>
            <Link
              href="/donate"
              className="btn-glass-secondary text-lg"
            >
              Make a Donation
            </Link>
            <Link
              href="/contact"
              className="btn-glass-secondary text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// Stack Card Component
function StackCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="glass-card flex items-center gap-4 hover:bg-white/15 transition-all">
      <div className="text-gray-900 bg-white rounded-lg p-2">
        {icon}
      </div>
      <span className="text-lg font-semibold text-white">{label}</span>
    </div>
  )
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="glass-card text-center hover:bg-white/15 transition-all">
      <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">{number}</h3>
      <p className="text-gray-300 font-medium">{label}</p>
    </div>
  )
}
