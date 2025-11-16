import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router.ts'
import { ThemeProvider } from '@emotion/react'
import theme from './theme.tsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
