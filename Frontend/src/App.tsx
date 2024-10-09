import { Route, Routes } from 'react-router-dom';

import Header from './components/ui/Header';
import { HomePage, LoginPage, SignUpPage, TransactionPage, NotFound } from './pages';
function App() {
  const authUser = true;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/transaction/:id' element={<TransactionPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
