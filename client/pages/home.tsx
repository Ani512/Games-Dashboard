import React, { useContext } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import Top from '../components/Top';
import HomePage from '../components/home/HomePage';
import isUserAuth from '../components/isAuthenticated';
import { GlobalContext } from './_app';

async function foo(user: any) {
  const _user = JSON.parse(user);
  const res = await fetch("https://nodejsgamedashbe.herokuapp.com/putFriend" + _user);
  const friendsList: string[] | [] = await res.json();
  return friendsList;
}

const Home: NextPage = () => {
  isUserAuth();
  
  const [friends, setFriends] = React.useState([]);
  let user: any;

  if (typeof window !== "undefined") {
      user = localStorage.getItem("username");
  } 

  const { setUserName } = useContext(GlobalContext);
  setUserName(user);

  React.useEffect(() => {
    foo(user).then((res: any) => setFriends(res));
  }, [])

  return (
    <div className={styles.container1}>
      <Top page={0} />
      <div style={{ paddingTop: 150, display: 'flex', flexDirection: 'row', padding: 50, backgroundColor: "#2f2f2f", justifyContent: "center", height: '80vh' }}>
        <HomePage friends={friends} />
      </div>
    </div>
  )
}

export default Home;