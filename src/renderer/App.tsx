import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { RecoilRoot } from 'recoil';

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="*" element={<div>404</div>} /> */}
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
