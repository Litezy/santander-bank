import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { AdminRoutes, FormRoutes, GeneralRoutes, UserRoutes } from './routes'
import UserLayout from './layouts/UserLayout'
import AuthRoutes from 'services/AuthRoutes'
import AdminLayout from 'layouts/AdminLayout'
import GeneralLayout from 'layouts/GeneralLayout'
import ScrollToTop from 'general/ScrollToTop'

export default function App() {
  const user = '/user/'
  const general = '/'
  const admin ='/admin/'
  return (
    <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {FormRoutes.map((item, index) => (
        <Route key={index} path={`${general}${item.path}`} element={<item.component />} />
      ))}
      {GeneralRoutes.map((item, index) => (
        <Route key={index} path={`${general}${item.path}`} element={<GeneralLayout><item.component /></GeneralLayout>} />
      ))}
      {UserRoutes.map((item, index) => (
        <Route key={index} path={`${user}${item.path}`} element={<UserLayout> <AuthRoutes><item.component /></AuthRoutes> </UserLayout>} />
      ))}
      {AdminRoutes.map((item, index) => (
        <Route key={index} path={`${admin}${item.path}`} element={<AdminLayout> <AuthRoutes><item.component /></AuthRoutes> </AdminLayout>} />
      ))}
     
    </Routes>
    </BrowserRouter>
  )
}
