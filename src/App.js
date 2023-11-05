import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./Router/Router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #D1D5DB",
            padding: "16px",
            color: "#000",
            fontSize: "16px",
          },
        }}
      />
    </div>
  );
}

export default App;
