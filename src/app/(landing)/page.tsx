import { Navbar } from "./_components/layout/navbar";
import { UnifiedLandingFlowCinematic } from "./_components/experience/unified-landing-flow-cinematic";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f6efe4] text-stone-950 antialiased">
      <Navbar variant="cinematic" />
      <main>
        <UnifiedLandingFlowCinematic />
      </main>
    </div>
  );
}
