import React from "react";

export const RestaurantSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-card-premium overflow-hidden flex flex-col min-h-[380px]">
          {/* Cover image skeleton */}
          <div className="h-48 bg-black/10 dark:bg-white/5 relative" />

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              {/* Title skeleton */}
              <div className="h-6 w-3/4 bg-black/10 dark:bg-white/5 rounded-xl" />
              {/* Description skeleton */}
              <div className="h-4 w-full bg-black/10 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-5/6 bg-black/10 dark:bg-white/5 rounded-lg" />
            </div>

            <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
              {/* Cuisine & Address skeletons */}
              <div className="h-4 w-1/2 bg-black/10 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-2/3 bg-black/10 dark:bg-white/5 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StaffSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-card-premium p-6 flex flex-col min-h-[160px] justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar skeleton */}
            <div className="w-14 h-14 rounded-2xl bg-black/10 dark:bg-white/5 flex-shrink-0" />

            <div className="space-y-2 flex-1">
              {/* Name and Email skeletons */}
              <div className="h-5 w-2/3 bg-black/10 dark:bg-white/5 rounded-xl" />
              <div className="h-3.5 w-1/2 bg-black/10 dark:bg-white/5 rounded-lg" />
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center mt-4">
            {/* Role & Actions skeletons */}
            <div className="h-8 w-24 bg-black/10 dark:bg-white/5 rounded-full" />
            <div className="h-9 w-9 bg-black/10 dark:bg-white/5 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      {[1, 2].map((n) => (
        <div key={n} className="glass-card-premium p-6 flex flex-col space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/5" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-1/3 bg-black/10 dark:bg-white/5 rounded-lg" />
              <div className="h-3 w-1/2 bg-black/10 dark:bg-white/5 rounded-md" />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 flex justify-between items-center">
                <div className="flex gap-4 items-center flex-1">
                  <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/4 bg-black/10 dark:bg-white/5 rounded-lg" />
                    <div className="h-3 w-1/3 bg-black/10 dark:bg-white/5 rounded-md" />
                  </div>
                </div>
                <div className="h-8 w-16 bg-black/10 dark:bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
