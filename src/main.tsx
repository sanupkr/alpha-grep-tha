import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import FolderReports from './components/folder-reports.tsx';
import FileReports from './components/file-reports.tsx';
import Header from './components/header.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path:'/reports/sub-folder/:folderId',
    element: <FolderReports/>
  },
  {
    path:'/reports/:folderId/file/:fileId',
    element: <FileReports />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <RouterProvider router={router} />
  </StrictMode>,
)
