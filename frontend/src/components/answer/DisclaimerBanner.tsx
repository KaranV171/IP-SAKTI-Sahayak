import React from "react";

interface DisclaimerBannerProps {
  disclaimerText?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ disclaimerText }) => {
  return (
    <div className="w-full bg-[#fef8ee] border border-[#faecd5] rounded-xl p-4 sm:p-5 mt-6 shadow-2xs">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-[#d97706] text-[1.25rem] mt-0.5 shrink-0">
          gavel
        </span>
        <div className="flex flex-col gap-1 text-xs text-[#78350f] leading-relaxed">
          <span className="font-mono font-bold text-[11px] text-[#92400e] uppercase tracking-wider">
            Statutory Jurisdictional Caveat
          </span>
          <p>
            {disclaimerText || "This information is for general guidance only and is not legal advice."}{" "}
            Synthesized strictly via retrieval-augmented artificial intelligence from verified statutory gazettes, patent examination guidelines, and traditional knowledge treaties. Patentability determinations remain under the sole jurisdiction of the Controller General of Patents, Designs and Trade Marks (CGPDTM).
          </p>
        </div>
      </div>
    </div>
  );
};
