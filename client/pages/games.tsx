import { NextPage } from 'next';
import React, { createContext, useContext, useState } from 'react';
import Top from '../components/Top';
import EnhancedTable from '../components/games/GamesList';
import AddGame from '../components/games/AddGame';
import isUserAuth from '../components/isAuthenticated';
import { GlobalContext } from './_app';

type GamesContextType = {
    games: any;
    setGames: any;
}

export const GamesContext = createContext<GamesContextType | any>({});

async function foo(user :any) {
    const _user = JSON.parse(user);
    const res = await fetch("https://games-dashboard.onrender.com/putGame" + _user);
    const gamesList = await res.json();
    return gamesList;
}

const Games: NextPage = () => {
    isUserAuth();
    const [games, setGames] = useState([]);
    const { userName } = useContext(GlobalContext);

    React.useEffect(() => {
        foo(userName).then((res) => setGames(res));
    }, [])

    return (
        <GamesContext.Provider value={{ games, setGames }}>
            <div>
                <Top page={1} />
                <div>
                    <EnhancedTable></EnhancedTable>
                    <AddGame />
                </div>
            </div>
        </GamesContext.Provider>
    )
}

export default Games;