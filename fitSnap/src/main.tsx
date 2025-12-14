import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './routes/router'
import { RouterProvider } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
