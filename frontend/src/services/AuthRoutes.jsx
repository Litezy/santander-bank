
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isExpired } from 'react-jwt'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { dispatchProfile } from 'app/reducer'
import { CookieName, errorMessage } from 'utils/functions'
import { Apis, GetApi } from './Api'



const AuthRoutes = ({ children }) => {
    const [login, setLogin] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get(CookieName)
                if (!token) {
                    setLogin(false)
                    return navigate(`/login`)
                }
                const isValidToken = isExpired(token)
                // console.log(isValidToken)
                if (isValidToken) {
                    setLogin(false)
                    Cookies.remove(CookieName)
                    return navigate(`/login`)
                }

                const response = await GetApi(Apis.auth.profile)
                if (response.status === 200) {
                    setLogin(true)
                    dispatch(dispatchProfile(response.data))
                }
            } catch (error) {
                errorMessage(`session expired`)
                return navigate(`/login`)
                 

            }
        }
        fetchProfile()
    }, [dispatch, navigate])
    if (login) return children
}

export default AuthRoutes