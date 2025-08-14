import { nurseryService } from "@/services/api";
import { slugToReadableName } from "@/lib/utils";

export default async function TestPortfolioPage({
  params,
}: {
  params: Promise<{ name: string; locale: string }>;
}) {
  const { name, locale } = await params;
  const readableName = slugToReadableName(name);

  // Fetch portfolio data for this nursery
  const portfolioResponse = await nurseryService.getNurseryPortfolio(
    readableName,
    locale
  );

  // Extract the actual portfolio data from the response
  const portfolio = portfolioResponse?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Portfolio Test for: {readableName}
      </h1>

      {portfolio ? (
        <div className="space-y-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              ✅ Portfolio Found
            </h2>
            <p className="text-green-700">
              Portfolio data was successfully fetched for this nursery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Portfolio Data Structure:
            </h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(portfolioResponse, null, 2)}
            </pre>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Available Sections:
            </h2>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              {portfolio.hero_section && <li>Hero Section</li>}
              {portfolio.branches && portfolio.branches.length > 0 && (
                <li>Branches ({portfolio.branches.length})</li>
              )}
              {portfolio.Philosophy_Methodology_Goal && (
                <li>Philosophy, Methodology & Goal</li>
              )}
              {portfolio.services && portfolio.services.length > 0 && (
                <li>Services ({portfolio.services.length})</li>
              )}
              {portfolio.nursery_state && <li>Nursery Stats</li>}
              {portfolio.images_activities &&
                portfolio.images_activities.length > 0 && (
                  <li>Activities ({portfolio.images_activities.length})</li>
                )}
              {portfolio.teams && portfolio.teams.length > 0 && (
                <li>Team ({portfolio.teams.length})</li>
              )}
              {portfolio.contact_info && <li>Contact Information</li>}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            ❌ No Portfolio Found
          </h2>
          <p className="text-red-700">
            No portfolio data was found for nursery: {readableName}
          </p>
          <p className="text-red-600 mt-2">This means either:</p>
          <ul className="list-disc list-inside mt-2 text-red-600">
            <li>The nursery doesn't exist in the database</li>
            <li>The nursery hasn't configured their profile yet</li>
            <li>There was an error fetching the data</li>
          </ul>
        </div>
      )}

      <div className="mt-8">
        <a
          href={`/${locale}/nurseries/${name}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          ← Back to Nursery Page
        </a>
      </div>
    </div>
  );
}
