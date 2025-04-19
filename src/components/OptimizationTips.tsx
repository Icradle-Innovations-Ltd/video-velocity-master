
import React from 'react';

export function OptimizationTips() {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Optimization Tips</h2>
      <div className="p-4 border rounded-lg bg-card">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">1</div>
            <p>Use multi-threaded downloads for maximum speed</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">2</div>
            <p>Enable proxy settings if you're on a restricted network</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">3</div>
            <p>Schedule large downloads during off-peak hours</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">4</div>
            <p>Convert videos to different formats for compatibility</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
