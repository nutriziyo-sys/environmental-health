import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import ProfessorPage from './components/Professor';
import ResearchPage from './components/Research';
import PublicationsPage from './components/Publications';
import AdminPage from './components/Admin';
import NewsArchive from './components/NewsArchive';
import TeamPage from './components/Team';
import InstrumentsPage from './components/Instruments';
import ConferencesPage from './components/Conferences';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="professor" element={<ProfessorPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="instruments" element={<InstrumentsPage />} />
          <Route path="conferences" element={<ConferencesPage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="news-archive" element={<NewsArchive />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
