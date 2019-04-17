import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export const AdminRoute = connect(mapStateToProps)(
  ({ render: Component, user, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return user.user.admin ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
        return <Redirect to="/login" />
      }}
    />
  )
)

export const InstructorRoute = connect(mapStateToProps)(
  ({ render: Component, user, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return user.user.instructor || user.user.admin ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
        return <Redirect to="/login" />
      }}
    />
  )
)

export const LoginRoute = connect(mapStateToProps)(
  ({ render: Component, user, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        return user ? <Component {...props} /> : <Redirect to="/login" />
      }}
    />
  )
)