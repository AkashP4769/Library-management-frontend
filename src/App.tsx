import { RouterProvider } from 'react-router'
import './App.css'
import ErrorBoundary from './pages/ErrorBoundary'
import router from './routes'

function App() {

  return <ErrorBoundary>
      {/* <Provider store={store}> */}
        <RouterProvider router={router} />
    {/* </Provider> */}
  </ErrorBoundary>
  
  
}

export default App;
