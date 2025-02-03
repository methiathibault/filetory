import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Menu from '../pages/Menu'
import LoginPage from '../pages/LoginPage'
import SubscribePage from '../pages/SubscribePage'
import FilesPage from '../pages/FilesPage'
import UsersPageTest from '../pages/UsersPageTest'
import Disconnect from './Disconnect'
import Account from '../pages/Account'
import Buy from '../pages/Buy'
import AdminPage from '../pages/AdminPage'

export default function Routing() {
  return (
    <Routes>
        <Route path="/" element={<Menu/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/subscribe" element={<SubscribePage/>}></Route>
        <Route path="/files" element={<FilesPage/>}></Route>
        <Route path="/users" element={<UsersPageTest/>}></Route>
        <Route path="/disconnect" element={<Disconnect/>}></Route>
        <Route path="/buy" element={<Buy/>}></Route>
        <Route path="/account" element={<Account/>}></Route>
        <Route path="/admin" element={<AdminPage/>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
