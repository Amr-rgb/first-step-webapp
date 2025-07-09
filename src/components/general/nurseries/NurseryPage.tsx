import BranchesList from "./sections/BranchesList";
import PhilosophyCards from "./sections/PhilosophyCards";
import Programs from "./sections/Programs";
import Services from "./sections/Services";
import Stats from "./sections/Stats";
import Activities from "./sections/Activities";
import Team from "./sections/Team";

interface NurseryPageProps {
  config: {
    branches?: string[];
    branchColors?: string[];
    philosophyCards?: any[];
    programs?: any[];
    services?: any[];
    stats?: any[];
    statsButtonText?: string;
    activitiesTitle?: string;
    activitiesSubtitle?: string;
    activities?: string[];
    activitiesButtonText?: string;
    team?: any[];
  };
}

const NurseryPage = ({ config }: NurseryPageProps) => (
  <div>
    {config.branches && (
      <BranchesList
        branches={config.branches}
        branchColors={config.branchColors}
      />
    )}
    {config.philosophyCards && (
      <PhilosophyCards sections={config.philosophyCards} />
    )}
    {config.programs && <Programs programs={config.programs} />}
    {config.services && <Services services={config.services} />}
    {config.stats && (
      <Stats stats={config.stats} buttonText={config.statsButtonText} />
    )}
    {config.activities && (
      <Activities
        title={config.activitiesTitle || ""}
        subtitle={config.activitiesSubtitle || ""}
        activities={config.activities}
        buttonText={config.activitiesButtonText}
      />
    )}
    {config.team && <Team members={config.team} />}
  </div>
);

export default NurseryPage;
