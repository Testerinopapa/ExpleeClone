import React from 'react';
import { NavigationProvider, useNavigation, PRODUCT_ROUTES } from './context/NavigationContext';
import OutreachAgentPage from './components/outreach/OutreachAgentPage';
import B2BPage from './components/b2b/B2BPage';
import GMPage from './components/gm/GMPage';
import ApiDocs from './components/docs/ApiDocs';
import ExplorerPage from './components/explorer/ExplorerPage';

function NotFoundPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-[#090b0b] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#111414] border border-white/[0.08] shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 text-white">404</h1>
        <p className="text-gray-400 mb-6 text-sm">
          The requested page could not be found. Select one of the available Explee products:
        </p>

        <div className="space-y-2 text-left">
          <button
            onClick={() => navigate(PRODUCT_ROUTES.OUTREACH)}
            className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition text-left cursor-pointer"
          >
            <div className="font-semibold text-sm text-white">Outreach Agent</div>
            <div className="text-xs text-gray-400">AI agents that find and email your buyers</div>
          </button>
          <button
            onClick={() => navigate(PRODUCT_ROUTES.DATABASE)}
            className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition text-left cursor-pointer"
          >
            <div className="font-semibold text-sm text-white">Database</div>
            <div className="text-xs text-gray-400">The largest B2B company database</div>
          </button>
          <button
            onClick={() => navigate(PRODUCT_ROUTES.GM)}
            className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition text-left cursor-pointer"
          >
            <div className="font-semibold text-sm text-white">Google Maps Dataset</div>
            <div className="text-xs text-gray-400">218M+ local businesses from Google Maps</div>
          </button>
          <button
            onClick={() => navigate(PRODUCT_ROUTES.API)}
            className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition text-left cursor-pointer"
          >
            <div className="font-semibold text-sm text-white">API</div>
            <div className="text-xs text-gray-400">REST API for company and people data</div>
          </button>
          <button
            onClick={() => navigate(PRODUCT_ROUTES.EXPLORER)}
            className="w-full p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition text-left cursor-pointer"
          >
            <div className="font-semibold text-sm text-white">Explorer</div>
            <div className="text-xs text-gray-400">Explore and filter the company graph</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function MainRouter() {
  const { currentProduct, navigate } = useNavigation();

  switch (currentProduct) {
    case 'outreach':
      return <OutreachAgentPage />;
    case 'database':
      return <B2BPage />;
    case 'gm':
      return <GMPage />;
    case 'api':
      return <ApiDocs onBackToLanding={() => navigate(PRODUCT_ROUTES.OUTREACH)} />;
    case 'explorer':
      return <ExplorerPage />;
    default:
      return <NotFoundPage />;
  }
}

export default function App() {
  return (
    <NavigationProvider>
      <MainRouter />
    </NavigationProvider>
  );
}
