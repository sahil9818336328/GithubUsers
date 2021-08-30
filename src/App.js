import React, { useEffect, useState } from 'react'
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import $ from 'jquery'

function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    $(function () {
      $('.loader').delay(2000).fadeOut('slow')
      $('#overlayer').delay(2000).fadeOut('slow')
      setLoading(false)
    })
  }, [])
  return (
    <>
      <div id='overlayer'>
        <span className='loader'>
          <span className='loader-inner'></span>
        </span>
      </div>
      {!loading && (
        <AuthWrapper>
          <Router>
            <Switch>
              <PrivateRoute path='/' exact>
                <Dashboard />
              </PrivateRoute>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='*'>
                <Error />
              </Route>
            </Switch>
          </Router>
        </AuthWrapper>
      )}
    </>
  )
}

export default App
