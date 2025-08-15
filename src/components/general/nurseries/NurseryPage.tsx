import BranchesList from "./sections/BranchesList";
import Philosophy from "./sections/Philosophy";
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
      <Philosophy
        data={{
          philosophy: {
            content:
              config.philosophyCards[0]?.text || "Our philosophy goes here",
          },
          methodology: {
            content:
              config.philosophyCards[1]?.text || "Our methodology goes here",
          },
          goals: {
            content: config.philosophyCards[2]?.text || "Our goal goes here",
          },
        }}
      />
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
