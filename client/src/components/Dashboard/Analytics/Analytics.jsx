import { useState, useEffect } from "react";
import api from "../../../libs/axiosInstance";
import { AnimatedNumber_002 } from "./ui/AnimatedNumbers"
import { Pattern } from "./ui/RadialChart"
import { OfferRateChart } from "./ui/OfferRateChart"

function Analytics() {
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    api.get("/api/jobs")
      .then(({ data }) => setJobCount((data.jobs || []).length))
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f5f4f3] xl:flex-row">

      <div className="flex min-w-0 flex-1 items-center justify-center border-b border-black/5 py-8 xl:border-r xl:border-b-0 xl:py-0">
        <AnimatedNumber_002
          finalCount={jobCount}
          className="!h-auto w-full"
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <OfferRateChart />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center border-t border-black/5 py-8 xl:border-l xl:border-t-0 xl:py-0">
        <Pattern />
      </div>

    </div>
  );
}

export default Analytics
