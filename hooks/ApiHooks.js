import {appId, baseUrl} from '../utils/Variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {getDistance, isPointWithinRadius} from 'geolib';
import {getUserLocation} from '../utils/Utils';

const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [mediaArrayInRange, setMediaArrayInRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    update,
    selectedPetType,
    isSearching,
    searchValue,
    setMarkers,
    currentUserLocation,
    setCurrentUserLocation,
    postsInRange,
    setPostsInRange,
  } = useContext(MainContext);
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  let jsonFilter;

  const loadMedia = async (start = 0, limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}tags/${appId}`);
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        let json = await response.json();

        if (myFilesOnly) {
          json = json.filter((file) => file.user_id === user.user_id);
        }

        if (selectedPetType === 'all') {
          jsonFilter = json;
        } else {
          jsonFilter = await getFilesByTag(`${appId}_pet_${selectedPetType}`);
        }

        if (isSearching && selectedPetType === 'all') {
          jsonFilter = json.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
          );
        } else if (isSearching && selectedPetType !== 'all') {
          const filesByTag = await getFilesByTag(
            `${appId}_pet_${selectedPetType}`
          );
          jsonFilter = filesByTag.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
          );
        }

        const media = await Promise.all(
          jsonFilter.map(async (item) => {
            const responseMedia = await fetch(
              baseUrl + 'media/' + item.file_id
            );
            const mediaData = await responseMedia.json();
            return mediaData;
          })
        );
        setMediaArray(media);
        return true;
      }
    } catch (e) {
      console.log('loading media error', e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Call loadMedia() only once when the component is loaded
  // OR when the update state is changed in mainContext
  useEffect(() => {
    loadMedia(0, 20);
  }, [update, searchValue, selectedPetType]);

  const loadMediaSecond = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}tags/${appId}`);
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        const json = await response.json();

        const media = await Promise.all(
          json.map(async (item) => {
            const responseMedia = await fetch(
              baseUrl + 'media/' + item.file_id
            );
            return await responseMedia.json();
          })
        );
        // console.log('MEDIA', media);
        await loadPostsInRange(media);
        // console.log('RESPONSEINRANGE', responsePostInRange);
        return media;
      }
    } catch (e) {
      console.log('loading media error', e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(async () => {
    await loadMediaSecond().then(
      async (media) =>
        await loadPostsOnMap(media).then((markers) => setMarkers(markers))
    );
  }, []);

  const loadPostsOnMap = async (mediaArr) => {
    const setOfMarkers = new Set();
    if (mediaArr !== undefined) {
      mediaArr.map((mediaPost) => {
        const postOnMap = JSON.parse(mediaPost.description);
        const rating = postOnMap.rating;
        const ratingCounter = rating ? postOnMap.rating.length : 0;
        const sumOfRatings = rating
          ? postOnMap.rating.reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              0
            )
          : 0;
        const averageRating = rating
          ? ((sumOfRatings / ratingCounter) * 10) / 10
          : 0;

        if (postOnMap.coords !== undefined) {
          setOfMarkers.add({
            whole: mediaPost,
            title: mediaPost.title,
            thumbnails: mediaPost.thumbnails,
            ratingCount: ratingCounter.toString(),
            ratingAverage: averageRating.toString(),
            coordinates: {
              latitude: postOnMap.coords.latitude,
              longitude: postOnMap.coords.longitude,
            },
          });
          // console.log(
          //   'title: ', mediaPost.title,
          //   'thumbnails', mediaPost.thumbnails,
          //   'coords: ', postOnMap.coords,
          //   'whole: ', mediaPost
          // );
        }
      });
    }
    return setOfMarkers;
  };

  useEffect(async () => {
    await loadMediaSecond().then(
      async (media) =>
        await loadPostsInRange(media).then((inRange) =>
          setPostsInRange(inRange)
        )
    );
  }, []);

  const loadPostsInRange = async (media) => {
    const postThatInRange = [];
    const userCoords = await getUserLocation();
    if (media !== undefined && userCoords !== undefined) {
      media.map((mediaPost) => {
        const desc = JSON.parse(mediaPost.description);
        const result = isPointWithinRadius(
          {
            latitude: desc.coords.latitude,
            longitude: desc.coords.longitude,
          },
          {
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
          },
          10000
        );
        const distance = getDistance(
          {
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
          },
          {
            latitude: desc.coords.latitude,
            longitude: desc.coords.longitude,
          },
          100
        );

        // console.log(
        //   'mediaPost title: ',
        //   mediaPost.title,
        //   'distance: ',
        //   distance,
        //   'is withing radius 10km ',
        //   result
        // );
        // console.log('result', result);
        if (result) {
          // console.log('in result before setPostsInRange');
          postThatInRange.push({
            whole: mediaPost,
            title: mediaPost.title,
            distanceFromCurrent: (distance / 1000).toString(),
            thumbnails: mediaPost.thumbnails,
            coordinates: {
              latitude: desc.coords.latitude,
              longitude: desc.coords.longitude,
            },
          });
          // console.log('posts in range', postThatInRange);
        }
      });
    }
    return postThatInRange;
  };

  const postMedia = async (formData, token) => {
    setLoading(true);
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };

    const result = await doFetch(baseUrl + 'media', options);
    result && setLoading(false);
    return result;
  };

  const putMedia = async (data, token, fileId) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: data,
    };
    return await doFetch(`${baseUrl}media/${fileId}`, options);
  };

  const getSingleMedia = async (fileId, token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(`${baseUrl}media/${fileId}`, options);
  };

  const deleteMedia = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await doFetch(`${baseUrl}media/${fileId}`, options);
  };

  const getPostsByUserId = async (userId) => {
    const json = await useTag().getFilesByTag(appId);
    return json.filter((item) => item.user_id === userId);
  };

  return {
    mediaArray,
    postMedia,
    loading,
    getSingleMedia,
    deleteMedia,
    putMedia,
    getPostsByUserId,
    loadPostsOnMap,
    loadPostsInRange,
  };
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(baseUrl + 'login', options);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'users/user', options);
  };

  const getUserById = async (userId, token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(`${baseUrl}users/${userId}`, options);
  };

  const postUser = async (data) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'users', options);
  };

  const putUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'users', options);
  };

  const checkUsername = async (username) => {
    const result = await doFetch(baseUrl + 'users/username/' + username);
    return result.available;
  };

  const getAllUserId = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    const result = await doFetch(baseUrl + 'users', options);
    return result.map((user) => {
      return user.user_id;
    });
  };

  const getUserInfo = async (userId, token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    const result = await doFetch(`${baseUrl}users/${userId}`, options);
    return result;
  };

  return {
    getUserByToken,
    getUserById,
    postUser,
    checkUsername,
    putUser,
    getAllUserId,
    getUserInfo,
  };
};

const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(tagData),
    };
    return await doFetch(baseUrl + 'tags/', options);
  };

  const getFilesByTag = async (tag) => {
    return await doFetch(baseUrl + 'tags/' + tag);
  };

  const getTagsForFile = async (fileId) => {
    const options = {
      method: 'GET',
      headers: {
        // 'x-access-token': token,
      },
    };
    return await doFetch(`${baseUrl}tags/file/${fileId}`, options);
  };

  return {postTag, getFilesByTag, getTagsForFile};
};

const useFavourite = () => {
  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    return await doFetch(`${baseUrl}favourites`, options);
  };
  const getFavouritesByFileId = async (fileId) => {
    return await doFetch(`${baseUrl}favourites/file/${fileId}`);
  };
  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${baseUrl}favourites/file/${fileId}`, options);
  };
  const getFavourites = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'favourites', options);
  };

  return {postFavourite, getFavouritesByFileId, deleteFavourite, getFavourites};
};

const useRating = () => {
  const addRating = async (ratingData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(ratingData),
    };
    return await doFetch(baseUrl + 'ratings', options);
  };
  const getRatingsForFile = async (fileId, token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${baseUrl}ratings/file/${fileId}`, options);
  };

  return {addRating, getRatingsForFile};
};

const useComments = () => {
  const getCommentsForUser = async (userToken) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': userToken,
      },
    };
    return await doFetch(`${baseUrl}comments`, options);
  };
  const getCommentsForFile = async (userId) => {
    return await doFetch(`${baseUrl}comments/file/${userId}`);
  };
  const postComment = async (data, userToken) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'comments', options);
  };



  return {getCommentsForFile, postComment, getCommentsForUser};
};

export {
  useMedia,
  useLogin,
  useUser,
  useTag,
  useFavourite,
  useRating,
  useComments,
};
