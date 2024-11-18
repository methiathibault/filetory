import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Menu from '../pages/Menu'
import LoginPage from '../pages/LoginPage'
import SubscribePage from '../pages/SubscribePage'
import FilesPage from '../pages/FilesPage'

export default function Routing() {
  return (
    <Routes>
        <Route path="/" element={<Menu/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/subscribe" element={<SubscribePage/>}></Route>
        <Route path="/files" element={<FilesPage/>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
