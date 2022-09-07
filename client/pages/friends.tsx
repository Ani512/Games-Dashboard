import { NextPage } from 'next';
import React, { createContext, useState, useContext } from 'react';
import Top from '../components/Top';
import InteractiveList from '../components/friends/FriendsList';
import AddFriend from '../components/friends/AddFriends';
import isUserAuth from '../components/isAuthenticated';
import { GlobalContext } from './_app';

type FriendsContextType = {
    friends: any;
    setFriends: any;
};

export const FriendsContext = createContext<FriendsContextType | any>({}); 

async function foo(user: any) {

    const _user = JSON.parse(user);
    const res = await fetch("https://nodejsgamedashbe.herokuapp.com/putFriend" + _user);
    
    const friendsList: any = await res.json();
    return friendsList;
}

const Friend: NextPage = () => {
    isUserAuth();
    const [friends, setFriends] = useState([]);
    const { userName } = useContext(GlobalContext);

    React.useEffect(() => {
        foo(userName).then((res) => setFriends(res));
    }, [])

    return (
        <FriendsContext.Provider value={{friends, setFriends}}>
            <div>
                <Top page={2} />
                <div>
                    <InteractiveList />
                    <AddFriend />
                </div>
            </div>
        </FriendsContext.Provider>
    )
}

export default Friend;