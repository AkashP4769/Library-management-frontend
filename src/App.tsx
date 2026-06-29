import { RouterProvider } from 'react-router'
import './App.css'
import ErrorBoundary from './pages/ErrorBoundary'
import router from './routes'
import { Provider } from 'react-redux'
import { store } from './store/store'

function App() {

  return <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </ErrorBoundary>
  
  
}

export default App;
