import React from 'react'
import {Routes, Route} from 'react-router-dom'
import SideBar from '../Sidebar'
import AdminRouters from '../../Router/AdminRouters'
import { Router } from 'express'
import sidebar_menu from '../../constants/sidebar-menu'


const AdminLayout = () => {
  return <>
    <div className='dashboard-container'>
        <SideBar menu={sidebar_menu}/>
          
          <div className='dashboard-body'>
              <AdminRouters/>
          </div>
      </div>
  </>
}

export default AdminLayout
