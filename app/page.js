"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';





function App() {
  const CLIENT_ID = "8403372c67d44bd7b136e5ac17665703"
  const REDIRECT_URI = "https://amari-trackify.vercel.app"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [profileimage, setProfileImage] = useState(null);
  const [activeTypeTab, setTypeActiveTab] = useState(1);
  const [activeTimeTab, setTimeActiveTab] = useState(1);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  

  const handleTabClick = (tabIndex) => {
    setTypeActiveTab(tabIndex);
  };

  const handleTimeTabClick = (tabIndex) => {
    setTimeActiveTab(tabIndex);
  };
  "ssss"

 
  // const getToken = () => {
  //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
  //     let token = urlParams.get('access_token');
  // }

  useEffect(() => {
      const hash = window.location.hash
      let token = window.localStorage.getItem("token")

      // getToken()


      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

          window.location.hash = ""
          window.localStorage.setItem("token", token)
      }

      setToken(token)

  }, [])

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
      // Reload the page to ensure that the user is fully logged out
      window.location.reload();
  }

  useEffect(() => {
    if (token) {
      getCurrentUserProfile();
      getTopTracks();
      getTopArtists();
      getTopGenres();
    }
  }, [token, activeTimeTab]); // Add activeTimeTab as a dependency  );


  const getCurrentUserProfile = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userProfile = response.data;
      const profileImage = userProfile.images[0].url;
      setProfileImage(profileImage);
      console.log(profileimage)
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      throw error;
    }
  };
  const getTopTracks = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: getTimeRange(),
          limit: 10, 
        },
      });

      const topTracks = response.data.items;
      setTopTracks(topTracks);
    } catch (error) {
      console.error('Error retrieving top tracks:', error);
      throw error;
    }
  };

  const getTopArtists = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: getTimeRange(),
          limit: 10, 
        },
      });

      const topArtists = response.data.items;
      setTopArtists(topArtists);
    } catch (error) {
      console.error('Error retrieving top artists:', error);
      throw error;
    }
  };

  const getTopGenres = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: getTimeRange(),
        },
      });

      const topArtists = response.data.items;
      const topGenres = topArtists.flatMap((artist) => artist.genres).slice(0, 10);
      setTopGenres(topGenres);
    } catch (error) {
      console.error('Error retrieving top genres:', error);
      throw error;
    }
  };

  const getTimeRange = () => {
    if (activeTimeTab === 1) {
      return 'short_term';
    } else if (activeTimeTab === 2) {
      return 'medium_term';
    } else {
      return 'long_term';
    }
  };

  const handleButtonClick = () => {
    if (token) {
      const dataElement = document.getElementById('data');
      dataElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`;
    }
  };



  return (
        <div>
          <div className="navbar fixed top-0 left-0">
              <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">Trackify</a>
              </div>
              <div className="flex-none gap-2">
                <div className="form-control">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    {token ? (
                      <img src={profileimage} alt="Profile Picture" />
                    ) : (
                      <img src="https://as2.ftcdn.net/v2/jpg/03/59/58/91/1000_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg" alt="Default Profile Picture" />
                    )}
                  </div>
                                    </label>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    {/*
                    <li>
                      <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                      </a>
                    </li>
                    <li><a>Settings</a></li> */}
                    {!token ?
                  <li><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}>Login</a></li>
                  : <li><button onClick={logout}>Logout</button></li>}
                  </ul>
                </div>
              </div>
          </div>
          <section id='hero ' className='h-screen'>
            <div className='flex flex-col md:flex-row items-center px-6 mx-auto mt-20 md:mt-10 space-y-0 md:space-y-0'>
                <div className='flex flex-col mb-32 space-y-8 md:w-1/2 md:ml-10'>
                  <h1 className='max-w-md text-4xl font-bold text-center md:text-7xl md:text-left'>Music makes your day <span  className='bg-gradient-to-r from-[#1DB954] to-[#191414] text-transparent bg-clip-text'>colorful.</span></h1>
                  <p className='max-w-sm text-center text-darkGrayishBlue md:text-left'>Discover and explore your favorite music with Trackify, the ultimate music companion.</p>
                  <div className='flex justify-center md:justify-start'>
                    <button className='bg-black py-4 px-7 text-[13px] rounded-[25px] text-white '><a onClick={handleButtonClick}>See Data Now</a></button>
                  </div>
                  
                </div>
                <div className='md:w-1/2 hidden md:block'>
                  <img src='https://cdn.leonardo.ai/users/e1d5d611-baf8-4473-8dd7-1c012f4d9811/generations/83b8f801-43d8-4f5a-b37c-a6262c14e47f/variations/Default_a_detailed_illustration_of_a_side_profile_of_someone_w_0_83b8f801-43d8-4f5a-b37c-a6262c14e47f_0.png' width={500} height={400}></img>
                </div>
            </div>
            
          </section>
          <section className='min-h-screen p-5' id='data'>
                    <h1 className=' text-center font-bold mt-8 text-5xl  '> Stats for spotify</h1>
                    <div className='grid justify-center items-center mt-20'>
                    <div className="tabs tabs-boxed">
                      <a className={`tab ${activeTypeTab === 1 ? 'tab-active ' : ''}`} onClick={() => handleTabClick(1)}>Top Tracks</a> 
                      <a className={`tab ${activeTypeTab === 2 ? 'tab-active' : ''}`} onClick={() => handleTabClick(2)}>Top Genres</a> 
                      <a className={`tab ${activeTypeTab === 3 ? 'tab-active' : ''}`} onClick={() => handleTabClick(3)}>Top Artists</a>
                    </div>
                    </div>
                    <div className='grid justify-center items-center mt-8'>
                    <div className='bg-base-200 p-10 rounded-[30px]'>
                    <div className="tabs">
                      <a className={`tab tab-lifted  ${activeTimeTab === 1 ? 'tab-active' : ''}`} onClick={() => handleTimeTabClick(1)}>4 weeks</a> 
                      <a className={`tab tab-lifted ${activeTimeTab === 2 ? 'tab-active' : ''}`} onClick={() => handleTimeTabClick(2)}>6 months</a> 
                      <a className={`tab tab-lifted ${activeTimeTab === 3 ? 'tab-active' : ''}`} onClick={() => handleTimeTabClick(3)}>All</a>
                    </div>
                    <div className="overflow-x-auto">
                    {activeTypeTab === 1 && (
                    
                        <table className="table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th>Artist</th>
                              <th>Album</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topTracks.map((track, index) => (
                              <tr key={track.id}>
                                <td>{index + 1}</td>
                                <td>{track.name}</td>
                                <td>{track.artists[0].name}</td>
                                <td>{track.album.name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      
                    )}
                    {activeTypeTab === 2 && (
                    
                        <table className="table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Genre</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topGenres.map((genre, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{genre}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      
                    )}
                    {activeTypeTab === 3 && (
                  
                        <table className="table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th>Followers</th>
                              <th>Popularity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topArtists.map((artist, index) => (
                              <tr key={artist.id}>
                                <td>{index + 1}</td>
                                <td>{artist.name}</td>
                                <td>{artist.followers.total}</td>
                                <td>{artist.popularity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    
                    )}
                        </div>
                        </div>
                    </div>

          </section>
          {/*
          <header className="App-header">
              <h1>Spotify React</h1>
              {!token ?
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}>Login
                      to Spotify</a>
                  : <button onClick={logout}>Logout</button>}

              <>
            <button onClick={getTopArtists}>Get Top Artists</button>
            {topArtists.length > 0 && (
              <div>
                <h2>Top Artists</h2>
                {topArtists.map((artist) => (
                  <p key={artist.id}>{artist.name}</p>
                ))}
              </div>
            )}
          </>

          </header>
          */}

        </div>
        
          
  );
}

export default App;