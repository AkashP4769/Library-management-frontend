import { RouterProvider } from 'react-router'
import './App.css'
import ErrorBoundary from './pages/ErrorBoundary'
import router from './routes'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastProvider } from './Components/ui/Toast'

function App() {

  return <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
    </Provider>
  </ErrorBoundary>
  
  
}

export default App;
