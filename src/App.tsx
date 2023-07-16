import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './components';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
  ]);

  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}

export default App;
