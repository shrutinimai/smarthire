import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs } from "../store/jobSlice";
import { MapPin, Briefcase, DollarSign, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.toLowerCase().includes(search.toLowerCase());
    const matchType = jobType ? job.jobType === jobType : true;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Browse All Jobs</h1>
          <p className="text-indigo-100 mb-8">Find your perfect role from top companies</p>

          {/* Search + Filter */}
          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-3xl mx-auto shadow-xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="text-gray-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                placeholder="Search by title or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-gray-700 text-sm"
              />
            </div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="text-sm text-gray-600 border-l border-gray-200 px-3 outline-none"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="remote">Remote</option>
              <option value="internship">Internship</option>
            </select>
            <button className="gradient-bg text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No jobs found matching your search</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm mb-6">{filtered.length} jobs found</p>
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover flex justify-between items-start"
              >
                <div className="flex gap-4">
                  {/* Company Avatar */}
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {job.company?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <p className="text-primary font-medium text-sm">{job.company?.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {job.openings} openings
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {job.skills.split(",").map((skill) => (
                        <span
                          key={skill}
                          className="bg-indigo-50 text-primary text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    job.jobType === "remote"
                      ? "bg-green-100 text-green-600"
                      : job.jobType === "internship"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {job.jobType}
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;