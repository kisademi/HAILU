import React from 'react';
import { BreakPopupModal } from './components/BreakPopupModal';
import { NavigationShell } from './components/NavigationShell';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { AuthPage } from './pages/AuthPage';
import { CheckInPage } from './pages/CheckInPage';
import { EcommercePromoPage } from './pages/EcommercePromoPage';
import { EventRulesPage } from './pages/EventRulesPage';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PointsMallPage } from './pages/PointsMallPage';
import { ProfilePassportPage } from './pages/ProfilePassportPage';
import { SharePosterPage } from './pages/SharePosterPage';
import { StudyRoomPage } from './pages/StudyRoomPage';

const MainRouter: React.FC = () => {
  const { isAuthorized, activeTab, subPage } = useAppState();

  if (!isAuthorized) {
    return <AuthPage />;
  }

  const renderPage = () => {
    if (subPage === 'mall') return <PointsMallPage />;
    if (subPage === 'rules') return <EventRulesPage />;
    if (subPage === 'promo') return <EcommercePromoPage />;
    if (subPage === 'poster') return <SharePosterPage />;

    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'study':
        return <StudyRoomPage />;
      case 'checkin':
        return <CheckInPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePassportPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <NavigationShell>
      {renderPage()}
      <BreakPopupModal />
    </NavigationShell>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <MainRouter />
    </AppStateProvider>
  );
}
