import './HomeFeedPage.css';
import React from "react";

import DesktopNavigation  from 'components/DesktopNavigation';
import DesktopSidebar     from 'components/DesktopSidebar';
import ActivityFeed from 'components/ActivityFeed';
import ActivityForm from 'components/ActivityForm';
import ReplyForm from 'components/ReplyForm';
import { checkAuth, getAccessToken } from 'lib/CheckAuth';

export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
      await getAccessToken()
      const access_token = localStorage.getItem("access_token")
      // console.log("ACCESS TOKEN FE is ===================>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<< ", access_token)
      const res = await fetch(backend_url, {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
        method: "GET"
      });
      console.log('RESULT FETCHED IS ==================', res)
      let resJson = await res.json();
      if (res.status === 200) {
        setActivities(resJson)
        console.log('HERES YOUR RESjson -------->>>>>', resJson)
      } else {
        console.log('ERROR from /api/activities/home ------->>>>>>>>>', res)
      }
    } catch (err) {
      console.log('ERROR CAUGHT IS: ====>>>>> ', err);
    }
  };


  
  React.useEffect(()=>{
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth(setUser);
  }, [])

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm  
          // user_handle={user}
          popped={popped}
          setPopped={setPopped} 
          setActivities={setActivities} 
        />
        <ReplyForm 
          activity={replyActivity} 
          popped={poppedReply} 
          setPopped={setPoppedReply} 
          setActivities={setActivities} 
          activities={activities} 
        />
        <div className='activity_feed'>
          <div className='activity_feed_heading'>
            <div className='title'>Home</div>
          </div>
          <ActivityFeed 
            setReplyActivity={setReplyActivity} 
            setPopped={setPoppedReply} 
            activities={activities} 
          />
        </div>
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}