import axios from 'axios'
import Cookies from 'js-cookie';
import stringToTags from './lib/stringToTags';



export const signup = async (user) => {
    try {
        const response = await axios.post('https://backend.whiseve.com/user/signup', 
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
        

        if (response.user) return response.user;

    } catch (error) {
        console.log("error in signup, please try again later!", error);
        return;
    }
}

export const login = async (username, password) => {
    try {
        const user = {
            username: username,
            password: password,
        }

        const response = await axios.post("https://backend.whiseve.com/user/login", 
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
        
        return { status: true, user: response.user };
    } catch (error) {
        return {status : false };
    }
}

export const getDrops = async () => {
    try {

        const response = await axios.get('https://backend.whiseve.com/drop/getDrops', {
            withCredentials: true,
        });
        
        return response.data.drops
    } catch (error) {
        return;
    }
};  

export const getDrop = async (id) => {
    try {
        const response = await axios.get('https://backend.whiseve.com/drop/getDrop', 
            { 
                params: { dropId: id },
                withCredentials: true,
            }, 
        )
        
        return response.data.drop;
    } catch (error) {
        return;
    }
}

export const getReplyForDrop = async (id) => {
    try {
        const response = await axios.get('https://backend.whiseve.com/response/getResponses', 
        { 
            params: { dropId: id },
            withCredentials: true,
        }    
        )
        
        return response.data.responses
    } catch (error) {
        return;
    }
}

export const postAnonymousDrop = async ({ content, year, branch, tags }) => {
    try {
        const body = {
            content,
            year,
            branch
        }

        if (tags) {
            const hashTags = stringToTags(tags);
            body.tags = hashTags
        }

        const response = await axios.post('https://backend.whiseve.com/drop/addAnonymousDrop', 
            body,
            {
                withCredentials: true
            }
        )
        return true
    } catch (error) {
        return false
    }
}

export const postDirectDrop = async ({ content, userName, branch, year, tags }) => {
    try {
        const body = {
            content, 
            userName,
            branch,
            year
        }

        if (tags) {
            const hashtags = stringToTags(tags);
            body.tags = hashtags;
        }

        const response = await axios.post('https://backend.whiseve.com/drop/addDirectDrop', 
            body, 
            {
                withCredentials: true
            }
        )

        console.log(response);

        return true;
    } catch (error) { 
        console.log('error sending post directly', error);
        return false
    }
}

export const addResponse = async (dropId, response, senderId) => {
    try {
        const body = {
            dropId,
            response,
        }

        if (senderId) {
            body.senderId = senderId
        }
        
        const result = await axios.post('https://backend.whiseve.com/response/addResponse', 
            body,
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
        const result = await axios.get('https://backend.whiseve.com/user/checkStatus',
            {
                withCredentials: true
            }
        );
        
        if (!result) {
            return;
        }

        const userData = result.data.user || (result.response?.data.user && result.response.data.user);

        if (!userData) {
            return;
        }

        return userData;
    } catch (error) {
        console.log(error);
        
        return;
    }
}

export const getUser = async (userToGetId) => {
    try {
        const response = await axios.get('https://backend.whiseve.com/user/getUser', 
            {
                params: {userToGetId},
                withCredentials: true,
            }
        )

        if (!response.data.user) {
            return;
        }
        return response.data.user;

    } catch (error) {
        console.log(error);
        return;
    }
}

export const likeADrop = async ( dropId ) => {
     try {
        
        const response = await axios.post('https://backend.whiseve.com/drop/likeDrop', 
            { dropId },
            {
                withCredentials: true,
            }
        )

        if (!response) {
            return;
        }

        return response.data;
    } catch (error) {
        console.log(error)
        return;
    }
}

export const removeLikeFromDrop = async (dropId) => {
    try {
        const response = await axios.post('https://backend.whiseve.com/drop/removeLikeDrop', 
            { dropId },
            {
                withCredentials: true,
            }
        )

        if (!response) return;
        return response.data;
    } catch (error) {
        return;
    }
}

export const sendFriendRequest = async (friendId) => {
    try {
        const response = await axios.post('https://backend.whiseve.com/user/friendRequest', 
            { friendId },
            {
                withCredentials: true,
            }
        )

        if (!response) return;

        return response.data;
    } catch (error) {
        return;
    }
}

export const acceptFriendRequest = async (friendId) => {
    try {
        const response = await axios.post('https://backend.whiseve.com/user/acceptRequest', 
            { friendId },
            {
                withCredentials: true,
            }
        );
        if (!response) {
            return;
        }

        return response.data
    } catch (error) {
        return;
    }
}

export const rejectFriendRequest = async (friendId) => {
    try {
        const response = await axios.post('https://backend.whiseve.com/user/rejectRequest', 
            { friendId },
            {
                withCredentials: true,
            }
        );
        
        if (!response) {
            return;
        }

        return response.data
    } catch (error) {
        return;
    }
}

export const changeProfilePic = async (imageData) => {
    try {
        const response = await axios.post("https://backend.whiseve.com/user/updateProfilePic", {
            profilePic : imageData,
        }, {
            withCredentials: true,
        })


        return response.data.user;
    } catch (error) {
        return;
    }
}

export const updateProfile = async ({ bio, status, userName }) => {
    try {
        const response = await axios.post('https://backend.whiseve.com/user/updateProfile', {
             bio, status, userName
        }, {
            withCredentials: true
        })

        if (!response.data.user) {
            return;
        }

        return response.data.user;
    } catch (error) {
        return;
    }
}

export const userDrops = async (userId)  => {
    try {
        const response = await axios.get('https://backend.whiseve.com/drop/getDropForUser', 
        {
            params : {userId : userId},
            withCredentials: true
        })

        if (!response.data.drops) return;

        return response.data.drops;
    } catch (error) {
        return;
    }
}