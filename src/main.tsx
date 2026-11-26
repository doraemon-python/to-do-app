import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createRepositoryFromUrl } from './data/createRepository.ts'
import './index.css'

const repository = createRepositoryFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App repository={repository} />
  </StrictMode>,
)
