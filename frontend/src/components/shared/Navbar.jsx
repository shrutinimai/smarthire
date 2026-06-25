import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            Smart<span className="text-primary">Hire</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/jobs" className="text-gray-600 hover:text-primary font-medium transition">
            Browse Jobs
          </Link>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-primary font-medium hover:underline transition">
                Login
              </Link>
              <Link
                to="/register"
                className="gradient-bg text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to={user.role === "company" ? "/company/dashboard" : "/candidate/dashboard"}
                className="text-gray-600 hover:text-primary font-medium transition"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;