import axios from "axios";

export const newsApiHomePage = async (pageNo) => {
    try {
        let response = await axios.get('https://news.crickapi.com/api/articlesOC/topics?page=1&limit=3');
        console.log(response.data);
        return response.data; // Return only the data part of the response
    } catch (error) {
        console.error('Error fetching news:', error);
        return null; // Handle the error properly
    }
};

export const newsApi= async () => {
    try {
        let response = await axios.get('https://news.crickapi.com/api/articles/filter/s_1PD?page=1&limit=99');
        console.log(response.data);
        return response.data; // Return only the data part of the response
    } catch (error) {
        console.error('Error fetching news:', error);
        return null; // Handle the error properly
    }
};

export const pointsTableApi = async() => {
    try {
 let response = await axios.get('https://api.msn.com/sports/standings?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-in&activityId=CBDF1AF6-89D8-4D4D-98F1-D7E63A87E667&ocid=sports-league-standings&it=edgeid&user=m-16AA5F8042236C562A2B4AFC43B86DE7&scn=APP_ANON&id=Cricket_IPL&idtype=league&seasonPhase=entireSeason')
 console.log(response.data)
 return response.data
    } catch(err) {
        console.log(err.message)
    }
}

export const matchScheduleApi = async() => {
    try{
let response = await axios.get('https://api.msn.com/sports/liveschedules?apikey=kO1dI4ptCTTylLkPL1ZTHYP8JhLKb8mRDoA5yotmNJ&version=1.0&cm=en-in&tzoffset=5&activityId=FC550B81-E8C3-4A83-8381-B0E853D31139&ocid=sports-league-schedule&it=edgeid&user=m-16AA5F8042236C562A2B4AFC43B86DE7&scn=APP_ANON&date=2025-03-22T03:12:48&ids=Cricket_IPL&type=leagueupcoming&withcalendar=false')
console.log(response.data);
return response.data.value[0].schedules[0].games
    } catch (err) {
        console.log(err)
    }
}


const API_KEY = "2993c7e1-0c4c-4d0d-be5b-4b65ad9e1b6b";

// Fetch all matches
export const allMatchesScoresApi = async () => {
  try {
    let response = await axios.get(
      `https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching cricket data:", err);
    return { data: [] }; // Prevent UI crashes
  }
};

// Fetch match details using match_id
export const fetchMatchDetailsApi = async (matchId) => {
  try {
    let response = await axios.get(
      `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&id=${matchId}`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching match details:", err);
    return null;
  }
};
