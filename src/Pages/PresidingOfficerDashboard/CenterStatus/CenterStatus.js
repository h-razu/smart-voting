import React from "react";
import { Link } from "react-router-dom";

const CenterStatus = () => {
  return (
    <section class="bg-white">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
          <h1 class="mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-primary-600">Center is Closed</h1>
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
      </div>
    </section>
  );
};

export default CenterStatus;
