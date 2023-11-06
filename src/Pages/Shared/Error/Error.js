import React from "react";
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-8">
      <h1 className="text-6xl font-bold" style={{ fontFamily: "Redressed" }}>
        Oops!
      </h1>
      <p className="text-4xl font-semibold" style={{ fontFamily: "Redressed" }}>
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-2xl text-red-700">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/smart-voting">
        <div class="mt-10 space-y-20">
          <div class="w-full">
            <div class="flex-1 h-full w-96 mx-auto">
              <div class="flex w-full bg-white shadow rounded-lg py-4 px-16">
                <p class="m-auto inset-0 text-xl font-semibold leading-7 text-center text-gray-800">Go To Home</p>
                <div class="">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Error;
