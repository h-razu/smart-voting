import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authProvider } from "../../../Context/AuthContext/AuthContext";
import useTitle from "../../../Context/useTitle/useTitle";

const AdminLogin = () => {
  useTitle("Admin Login");

  const { setAdmin, adminLogin } = useContext(authProvider);
  const navigate = useNavigate();

  const formSubmitHandler = (event) => {
    event.preventDefault();

    const id = event.target.id.value;
    const pass = event.target.password.value;

    // console.log(id, pass);

    if (adminLogin(id, pass)) {
      localStorage.setItem("admin", JSON.stringify("Md Razu"));
      setAdmin("Md. Razu");
      navigate("/smart-voting/admin", { replace: true });
    } else {
      toast.error("Wrong!!!");
    }

    event.target.id.value = "";
    event.target.password.value = "";
  };

  return (
    <div>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Smart Voting
          </h1>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Admin Sign In</h1>
              <form className="space-y-4 md:space-y-6" onSubmit={formSubmitHandler}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-left">User ID:</label>
                  <input
                    type="text"
                    id="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 text-left">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-block my-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
