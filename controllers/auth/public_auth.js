
const Cookies = require('cookies')
const cookieCutter = require('cookie-cutter')


const getToken = (req, res, refresh_token, creds) => {
    const cookies = new Cookies(req, res)
    console.log('running getToken')
    // console.log('------------getToken: ', creds)
    const isServer = !!req
    const isBrowser = !req
    const bod = {} //new FormData();
    let ct
    if (isBrowser) {
        console.log('running getToken in the BROWSER')
        ct = cookieCutter.get('access_token')
        console.log("B getToken ct == ", ct)
        if (typeof ct == "string") {
            ct = JSON.parse(ct)
        }
        if (ct && ct.expires && ct.expires > Date.now()) {
            return ct
        } else {
            console.log('Refreshing the page...')
          
        }
    } else if (isServer) {
        console.log('running getToken in the SERVER')
        ct = cookies.get('access_token')
        console.log("S getToken ct == ", ct)
        if (typeof ct == "string") {
            ct = JSON.parse(ct)
        }
        if (ct && ct.expires && ct.expires > Date.now()) {
            return ct
        }
    }
    if (refresh_token && refresh_token.length > 0 && refresh_token != null) {
        console.log('Refreshing token...')
        bod.grant_type = "refresh_token"
        bod.refresh_token = refresh_token
    } else {
        console.log('Getting new token...')
        bod.grant_type = "password"
        bod.username = creds?.username || process.env.NEXT_PUBLIC_CLIENT_USERNAME
        bod.password = creds?.password || process.env.NEXT_PUBLIC_CLIENT_PASSWORD
    }
    bod.client_id = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID
    bod.client_secret = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_SECRET

    return fetch(process.env.NEXT_PUBLIC_PUBLIC_TOKEN_URL, {
        'method': 'POST',
        'headers': {
            "Accept": "application/json",
            'cache-control': "no-cache",
            "Content-Type": "application/x-www-form-urlencoded", 
            "Authorization": "Basic " + Buffer.from(process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID + ":" + process.env.NEXT_PUBLIC_CLIENT_PUBLIC_SECRET).toString('base64')
        },
        'body': new URLSearchParams(bod).toString()//bod
    })
        .then(rs => rs.json())
        .then(response => {
            let tk = response;
            ////
            if (tk && tk.access_token && tk.expires_in && tk.access_token.length > 0) {
                console.log('Token refreshed.')
                let expiry = new Date(new Date().getTime() + (parseInt(tk.expires_in) * 1000))
                let tkn = {
                    'expires': expiry,
                    'token': tk.access_token,
                    'refresh_token': tk.refresh_token
                }
                ct = tkn
                if (isBrowser) {
                    console.log('Setting new BROWSER token')
                    cookieCutter.set('access_token', JSON.stringify(tkn), { expires: expiry, httpOnly: false })
                } else if (isServer) {
                    console.log('Setting new SERVER token')
                    cookies.set('access_token', JSON.stringify(tkn), { expires: expiry, maxAge: parseInt(tk.expires_in) * 1000, overwrite: true, httpOnly: false })
                }
                return tkn;
            } else {
                console.log('Error refreshing token: ', tk)
                if (isBrowser) {
                    cookieCutter.set('access_token', '', "{}", { expires: new Date(0), httpOnly: false })
                } else if (isServer) {
                    cookies.set('access_token', "{}", { expires: new Date(0), maxAge: 0, overwrite: true, httpOnly: false })
                }
                // res.redirect('/auth/login?was='+req.url+'&h=0')
                return { error: true, ...tk };
            }
        }).then(json => {
            // console.log('New token: ', json)
            return json;
        }).catch(err => {
            console.log('Error in getToken: ', err)
            return { error: true, ...err };
        })
}

const checkToken = async (req, res, isProtected, creds) => {
    const cookies = new Cookies(req, res)
    let crds = creds || null
    // console.log('------------checkToken: ', creds)
    const isServer = !!req
    const isBrowser = !req
    let ct
    if (isBrowser && typeof window != "undefined") {
        console.log('running checkToken in the BROWSER')
        ct = cookieCutter.get('access_token')
      
        if (ct && ct != null && ct != undefined && new Date(ct.expires) > Date.now()) {
            console.log('B Token is valid')
            return ct
        } else {
            console.log('Refreshing entire page...')
          
        }
    } else if (isServer) {
        console.log('running checkToken in the SERVER')
        ct = cookies.get('access_token')
        // console.log('ct: ', ct)
        if (typeof ct == "string") {
            ct = JSON.parse(ct)
        }
        // console.log("S checkToken ct == ", ct)
        if (ct && ct != null && ct != undefined && new Date(ct.expires) > Date.now()) {
            console.log('S Token is valid')//: ', ct)
            return ct
        }
    }
    //check of cookie has expired
    if (!ct || ct == null || ct == undefined || (ct && JSON.parse(ct).expires > Date.now())) {
        console.log('Token expired. Refreshing...')
        let refresh_token
        if (ct && ct != undefined && JSON.parse(ct).refresh_token != undefined) {
            refresh_token = JSON.parse(ct).refresh_token
        }
        return getToken(req, res, refresh_token, crds).then(tk => {
            if (!tk.error) {
                console.log('Token refreshed.')
                return tk;
            } else {
                console.log('Error refreshing token: ', tk)
                // res.redirect('/auth/login?was='+encodeURIComponent(req.url))
                return { error: true, ...tk };
            }
        })
    } else {
        ct = JSON.parse(ct)
        console.log('Token is valid.')
        return ct
    }
}

const getUserDetails = async (token, url) => {
    if (typeof window != "undefined") {
        let savedSession = window.sessionStorage.getItem('user')
        if (savedSession && savedSession.length > 0) {
            savedSession = JSON.parse(window.sessionStorage.getItem('user'))
        }
        if (savedSession && savedSession?.id && savedSession?.id.length > 0) {
            console.log('Saved session: ', savedSession)
            return savedSession
        }
        // console.log('W getUserDetails URL: ',url)
    }

    return fetch(url, {
        'method': 'GET',
        'headers': {
            "Accept": "application/json",
            'cache-control': "no-cache",
            "Authorization": "Bearer " + token
        }
    })
        .then(j => j.json())
        .then(response => {
            // console.log('=================== getUserDetails returned: ', response)
            if (response.detail || response.error) {
                console.log('Error in getUserDetails: ', response)
                return {
                    error: true, message: response.detail || response.error
                }
            }
            if (typeof window !== "undefined") {
                // console.log('getUserDetails returning ', response)
                window.sessionStorage.setItem('user', JSON.stringify(response))
            }
            return response
        }).catch(err => {
            console.log('Error in getUserDetails: ', err)
            return {
                error: true, message: err.message || err
            }
        })

}




module.exports = { checkToken, getToken, getUserDetails }