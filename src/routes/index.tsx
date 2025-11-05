import { createBrowserRouter, Outlet } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { HomePage } from '../pages/HomePage';
import { ExpressYourselfPage } from '../pages/ExpressYourselfPage';
import { ChallengeYourselfPage } from '../pages/ChallengeYourselfPage';
import { BrainyBitesPage } from '../pages/BrainyBitesPage';

export const router = createBrowserRouter([
  {
    element: <SiteLayout>
      <Outlet />
    </SiteLayout>,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/express', element: <ExpressYourselfPage /> },
      { path: '/challenge', element: <ChallengeYourselfPage /> },
      { path: '/brainy', element: <BrainyBitesPage /> },
    ],
  },
]);