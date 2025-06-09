import React from 'react';
import {Route, Routes} from "react-router-dom"
import Login from '../Pages/Authentication/Login';

function UnAuthenticatedRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Login/>}/>
    </Routes>
  )
}

export default UnAuthenticatedRoutes