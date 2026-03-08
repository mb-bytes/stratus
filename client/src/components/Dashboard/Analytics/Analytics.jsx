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
    <div className="flex flex-col md:flex-row min-h-dvh bg-[#f5f4f3]">

      <div className="flex flex-1 items-center justify-center border-b md:border-b-0 md:border-r border-black/5 py-10 md:py-0">
        <AnimatedNumber_002
          finalCount={jobCount}
          className="!h-auto w-full"
        />
      </div>

      <div className="flex flex-1 items-center justify-center p-10">
        <OfferRateChart />
      </div>

      <div className="flex flex-1 items-center justify-center border-t md:border-t-0 md:border-l border-black/5 py-10 md:py-0">
        <Pattern />
      </div>

    </div>
  );
}

export default Analytics