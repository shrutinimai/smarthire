import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { MapPin, Briefcase, DollarSign, Users, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/jobs/${id}`);
        setJob(data);
      } catch {
        toast.error("Job not found");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!user) return navigate("/login");
    if (user.role !== "candidate") return toast.error("Only candidates can apply");

    try {
      setApplying(true);
      await axios.post("/applications/apply", { jobId: id, coverLetter });
      toast.success("Applied successfully! 🎉");
      setApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main */}
          <div className="col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {job.company?.name?.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-primary font-medium">{job.company?.name}</p>
                  <div className="flex gap-4 mt-3 text-gray-500 text-sm flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.openings} openings</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.jobType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex gap-2 flex-wrap">
                {job.skills.split(",").map((skill) => (
                  <span key={skill} className="bg-indigo-50 text-primary font-medium px-4 py-2 rounded-xl text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Card */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Apply for this Job</h2>

              {applied ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="font-semibold text-green-600">Successfully Applied!</p>
                  <p className="text-gray-500 text-sm mt-2">We'll notify you about updates</p>
                </div>
              ) : (
                <>
                  <textarea
                    rows={5}
                    placeholder="Write a short cover letter... (optional)"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none mb-4"
                  />
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {applying ? "Applying..." : "Apply Now 🚀"}
                  </button>
                  {!user && (
                    <p className="text-center text-gray-500 text-xs mt-3">
                      You need to login to apply
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;