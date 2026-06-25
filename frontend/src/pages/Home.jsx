import { Link } from "react-router-dom";
import { Briefcase, Users, Building, ArrowRight, Search } from "lucide-react";

const stats = [
  { label: "Jobs Posted", value: "10K+", icon: Briefcase },
  { label: "Companies", value: "500+", icon: Building },
  { label: "Candidates", value: "50K+", icon: Users },
];

const features = [
  { title: "Smart Job Matching", desc: "Get matched with jobs based on your skills automatically.", icon: "🎯" },
  { title: "Real-time Updates", desc: "Instant notifications when your application status changes.", icon: "⚡" },
  { title: "Easy Apply", desc: "Apply to multiple jobs with one click using your saved profile.", icon: "🚀" },
  { title: "Resume Builder", desc: "Upload and manage your resume with cloud storage.", icon: "📄" },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-bg text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 inline-block">
            🚀 #1 Job Portal for Developers
          </span>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Find Your Dream Job <br />
            <span className="text-yellow-300">Smarter & Faster</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Connect with top companies, apply with ease, and track your applications in real-time.
          </p>
          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                className="w-full outline-none text-gray-700 text-sm"
              />
            </div>
            <Link
              to="/jobs"
              className="gradient-bg text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              Search <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg text-center card-hover">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="text-white w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-primary">SmartHire?</span>
          </h2>
          <p className="text-gray-500 text-lg">Everything you need to land your next role</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-bg text-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Hired?</h2>
        <p className="text-indigo-100 text-lg mb-8">
          Join thousands of developers who found their dream job on SmartHire
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition">
            Start as Candidate
          </Link>
          <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-primary transition">
            Post a Job
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>© 2024 SmartHire. Built with ❤️ using React, Node.js, MySQL & MongoDB</p>
      </footer>
    </div>
  );
};

export default Home;