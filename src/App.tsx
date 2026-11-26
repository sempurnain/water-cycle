import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowToPlayPage } from './pages/HowToPlayPage';
import { ModeSelectionPage } from './pages/ModeSelectionPage';
import { LearningCenterPage } from './pages/LearningCenterPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { ExploreWorldPage } from './pages/ExploreWorldPage';
import { MiniGamesPage } from './pages/MiniGamesPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { MissionsPage } from './pages/MissionsPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { GameResultsPage } from './pages/GameResultsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ClassroomModePage } from './pages/ClassroomModePage';
import { TeacherLoginPage } from './pages/teacher/TeacherLoginPage';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudentsPage';
import { TeacherSessionsPage } from './pages/teacher/TeacherSessionsPage';
import { TeacherReportsPage } from './pages/teacher/TeacherReportsPage';
import {
  fetchTeacherClasses,
  fetchTeacherSessions,
  fetchTeacherStudents,
  subscribeTeacherAuth,
  testFirestoreConnection,
} from './services/firebase';
import { useAppStore } from './store/useAppStore';

function AppShell() {
  const location = useLocation();
  const { setTeacherAuth, setClasses, setStudents, setSessions } = useAppStore();

  useEffect(() => {
    testFirestoreConnection();
    const unsub = subscribeTeacherAuth(async (user) => {
      if (user) {
        setTeacherAuth(
          {
            uid: user.uid,
            name: user.displayName || 'Guru IPAS',
            email: user.email || '',
            schoolName: 'SD Nusantara',
            isDemo: false,
          },
          false,
        );
        try {
          const [classes, students, sessions] = await Promise.all([
            fetchTeacherClasses(user.uid),
            fetchTeacherStudents(user.uid),
            fetchTeacherSessions(user.uid),
          ]);
          setClasses(classes);
          setStudents(students);
          setSessions(sessions);
        } catch {
          // Handled safely via ErrorBoundary or fallback
        }
      }
    });
    return () => unsub();
  }, [setTeacherAuth, setClasses, setStudents, setSessions]);

  const isImmersiveRoute =
    location.pathname.startsWith('/classroom/') ||
    location.pathname === '/learn/explore' ||
    location.pathname === '/learn/simulator';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA]">
      {!location.pathname.startsWith('/classroom/') && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<HowToPlayPage />} />
          <Route path="/play" element={<ModeSelectionPage />} />

          <Route path="/learn" element={<LearningCenterPage />} />
          <Route path="/learn/materials" element={<MaterialsPage />} />
          <Route path="/learn/explore" element={<ExploreWorldPage />} />
          <Route path="/learn/games" element={<MiniGamesPage />} />
          <Route path="/learn/simulator" element={<SimulatorPage />} />
          <Route path="/learn/missions" element={<MissionsPage />} />
          <Route path="/learn/evaluation" element={<EvaluationPage />} />

          <Route path="/classroom/:sessionCode" element={<ClassroomModePage />} />
          <Route path="/results/:sessionId" element={<GameResultsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />

          <Route path="/teacher/login" element={<TeacherLoginPage />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/classes" element={<TeacherClassesPage />} />
          <Route path="/teacher/students" element={<TeacherStudentsPage />} />
          <Route path="/teacher/sessions" element={<TeacherSessionsPage />} />
          <Route path="/teacher/reports" element={<TeacherReportsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isImmersiveRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
