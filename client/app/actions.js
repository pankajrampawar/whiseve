import axios from 'axios'
import Cookies from 'js-cookie';


export const signup = async (user) => {
    try {
        const response = await axios.post('https://whiseve.com/user/signup', 
            { user },
            {
                withCredentials: true,
            }
        )

        if (response.headers['set-cookie']) {

            const cookiesFromResponse = response.headers['set-cookie'];

            cookiesFromResponse.forEach(cookie => {
                const [cookieName, cookieValue] = cookie.split(';')[0].split('=');
                Cookies.set(cookieName, cookieValue, { path: '/', sameSite: 'None', secure: true });
            });
         }
        
        console.log(response);

        if (response) return true

    } catch (error) {
        console.log("error in signup, please try again later!", error);

        return false;
    }
}

export const login = async (username, password) => {
    try {
        const user = {
            username: username,
            password: password,
        }

        const response = await axios.post("https://whiseve.com/user/login", 
            { user },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
       
        // Check if the response contains cookies
        if (response.headers['set-cookie']) {
           // Extract the cookies from the response headers
           const cookiesFromResponse = response.headers['set-cookie'];
           // Set the cookies on the client side
           cookiesFromResponse.forEach(cookie => {
               const [cookieName, cookieValue] = cookie.split(';')[0].split('=');
               Cookies.set(cookieName, cookieValue, { path: '/' , sameSite: 'None', secure: true });
           });
        }

        console.log(response);
        
        return true;
    } catch (error) {
        console.log("error logging in", error);
        alert(error)
        return false;
    }
}

export const getCrafts = async () => {
    try {

        const response = await axios.get('https://whiseve.com/craft/getCrafts', {
            withCredentials: true,
        });
        
        console.log(response.data);
        
        return response.data.crafts 
    } catch (error) {
        console.log("Error sending/ receiving the response", error);
    }
};

export const getCraft = async (id) => {
    try {
        const response = await axios.get('https://whiseve.com/craft/getCraft', 
            { 
                params: { craftId: id },
                withCredentials: true,
            }, 
        )
        
        console.log(response)
        return response.data.craft;
    } catch (error) {
        console.log("Error sending/ receiving the reply", error);
    }
}

export const getReplyForCraft = async (id) => {
    try {
        const response = await axios.get('https://whiseve.com/response/getResponses', 
        { 
            params: { craftId: id },
            withCredentials: true,
        }    
        )
        
        return response.data.responses
    } catch (error) {
        console.log("Error sending/ receiving the reply", error);
    }
}

export const postADrop = async (drop) => {
    try {
        const response = await axios.post('https://whiseve.com/craft/addCraft', 
            drop,
            {
                withCredentials: true
            }
        )

        console.log(response);
        return true
    } catch (error) {
        console.log("error sending / receiveing response", error)
        return false
    }
}

export const addResponse = async (craftId, response) => {
    try {
        const result = await axios.post('https://whiseve.com/response/addResponse', 
            { craftId, response },
            {
                withCredentials: true
            }
        )

        console.log(result);
        
        return true;
    } catch (error) {
        console.log("error sending response", error)
        return false
    }
}


export const checkAndGetUser = async () => {
    try {
        const result = await axios.get('https://whiseve.com/user/checkStatus',
            {
                withCredentials: true
            }
        );
        
        if (!result) {
            return false
        }

        console.log(result);

        return { status: true, user: result.data.user };
    } catch (error) {
        console.log(error);
        
        return false
    }
}




