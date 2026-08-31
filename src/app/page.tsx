import Link from 'next/link'
import { ShieldCheck, Utensils, CheckCircle, FileText, Activity } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-slate-800 tracking-tight">Food<span className="text-emerald-600">Guard</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">How It Works</Link>
              <Link href="#features" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Features</Link>
              <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-slate-200">
                <Link href="/login" className="text-slate-600 font-medium hover:text-emerald-600 transition-colors">Login</Link>
                <Link href="/register" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                  Register Hotel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-emerald-50/50 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-emerald-100/50 to-transparent -z-10 blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm mb-8">
            <Activity className="h-4 w-4" />
            <span>Digital Food Inspection Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Smart Food Inspection. <br/>
            <span className="text-emerald-600">Safer Food.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Digitizing food safety inspections through automated product verification, bill validation, expiry detection, and transparent inspection records.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/login?role=hotel" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
              <Utensils className="h-5 w-5" />
              Hotel Login
            </Link>
            <Link href="/login?role=officer" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Officer Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why FoodGuard?</h2>
            <p className="mt-4 text-lg text-slate-600">A comprehensive suite of tools for modern food safety management.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Digital Food Inspection", icon: ShieldCheck, desc: "End-to-end digital tracking of food safety standards and compliance." },
              { title: "Expiry Verification", icon: Activity, desc: "Automated OCR technology to detect and flag expiring or expired products." },
              { title: "Bill Validation", icon: FileText, desc: "Cross-check purchase bills against product labels to ensure authenticity." },
              { title: "Officer Management", icon: CheckCircle, desc: "Streamlined dashboard for officers to review, inspect, and approve submissions." },
              { title: "Violation Tracking", icon: FileText, desc: "Log and monitor food safety violations with evidence and severity levels." },
              { title: "Digital Reports", icon: Activity, desc: "Generate and download official PDF inspection reports instantly." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600">A seamless workflow from submission to verification.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              "Hotel uploads product image & label",
              "Hotel uploads purchase bill",
              "System extracts product information using AI/OCR",
              "Expiry date is detected and evaluated",
              "Bill details and product information are compared",
              "Food Safety Officer reviews the automated submission",
              "Final inspection result and report are generated"
            ].map((step, i) => (
              <div key={i} className="flex gap-4 mb-8 items-start group">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                  {i + 1}
                </div>
                <div className="pt-2">
                  <p className="text-lg text-slate-700 font-medium">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} FoodGuard - Digital Food Inspection Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
