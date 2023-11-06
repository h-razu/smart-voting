import { useContext } from "react";
import useTitle from "../../Context/useTitle/useTitle";
import bgImage from "../../images/bgImage.jpg";
import { Link } from "react-router-dom";
import { authProvider } from "../../Context/AuthContext/AuthContext";

const Home = () => {
  //title bar
  useTitle("Home");

  const { setIsPresidingOfficer } = useContext(authProvider);

  return (
    <div
      className="flex items-center justify-center h-screen flex-col lg:gap-12 bg-opacity-100"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backdropFilter: "blur(70px)",
      }}
    >
      <div>
        <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
          Smart Bangladesh Using Blockchain:{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Smart Voting</span>
        </h1>
      </div>
      <div className="bg-white bg-opacity-60 rounded-lg shadow-lg overflow-hidden w-full md:w-4/5 lg:w-3/5 xl:w-2/5">
        <div className="flex md:flex-row flex-col">
          <div className="md:w-1/2 p-8 flex items-center justify-around flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-800 mb-4">This panel is for the Admin. To go the next page click on login.</p>
            <Link to="adminLogin">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
            </Link>
          </div>

          <div className="md:w-1/2 p-8 flex items-center justify-around flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Presiding Officer</h1>
            <p className="text-gray-800 mb-4">This panel is for the Presiding Officer. To go the next page click on login.</p>

            <Link to="presidingOfficerLogin">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsPresidingOfficer(true)}>
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
