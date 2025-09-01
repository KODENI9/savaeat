import React from "react";

const Skeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="card bg-base-100 shadow-lg border border-gray-200 rounded-xl overflow-hidden animate-pulse"
        >
          {/* Bannière skeleton */}
          <div className="w-full h-24 bg-gray-200"></div>

          <div className="flex gap-4 p-5 items-center">
            {/* Profil skeleton */}
            <div className="w-24 h-24 bg-gray-200 rounded-xl ring-1 ring-gray-200"></div>

            <div className="flex-1 space-y-3">
              {/* Nom skeleton */}
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              {/* Adresse skeleton */}
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>

              {/* Étoiles et nombre d’avis skeleton */}
              <div className="flex justify-start items-center gap-2">
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
                <div className="h-3 w-6 bg-gray-200 rounded"></div>
              </div>

              {/* Distance + bouton skeleton */}
              <div className="flex justify-between items-center mt-3">
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
