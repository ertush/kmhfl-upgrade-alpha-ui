import 'tailwindcss/tailwind.css'
import '/assets/css/style.css';

import NProgress from 'nprogress';
import { Router } from 'next/router';
import { positions, Provider } from "react-alert";
import { PermissionContext } from '../providers/permissions';
import { UserGroupContext } from '../providers/userGroup';
import { UserContext } from '../providers/user';
import AlertTemplate from "react-alert-template-basic";



import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());  

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT
};

export default function App(props) {
 

  const  { Component, pageProps, ctx } = props

//  console.log({pageProps, ctx})
  return (
    
    <Provider template={AlertTemplate} {...options}>
      <UserContext.Provider value={(() => {
          let user
          if (typeof window !== "undefined") {
                // user = JSON.parse(window.sessionStorage.getItem('user'))
                user = JSON.parse(window.localStorage.getItem('user'))
          }
          // console.log({'_app_user':user})
        return user
        
        })()}>
        <UserGroupContext.Provider value={(() => {
           let userGroup
           if (typeof window !== "undefined") {
                //  userGroup = JSON.parse(window.sessionStorage.getItem('user'))?.groups[0]?.name
                 userGroup = JSON.parse(window.localStorage.getItem('user'))?.groups[0]?.name
         }
         return userGroup
        })()}>
        <PermissionContext.Provider value={(() => {
          let userPermissions
          if (typeof window !== "undefined") {
                // userPermissions = JSON.parse(window.sessionStorage.getItem('user'))?.all_permissions
                userPermissions = JSON.parse(window.localStorage.getItem('user'))?.all_permissions
        }
        return userPermissions
        
        })()}>
          <Component {...pageProps} />
        </PermissionContext.Provider>
        </UserGroupContext.Provider>
      </UserContext.Provider>
     
    </Provider>
  )
  
}



