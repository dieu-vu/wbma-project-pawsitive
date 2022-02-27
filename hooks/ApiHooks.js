import {appId, baseUrl} from '../utils/Variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

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
  const [loading, setLoading] = useState(false);
  const {update, selectedPetType, isSearching, searchValue} =
    useContext(MainContext);
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

        // TODO: JsonFilter below is for json data test, correct to json when done
        // const jsonFilter = json.filter((item) => item.user_id === 13);
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
      }
    } catch (e) {
      console.log('loading media error', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Call loadMedia() only once when the component is loaded
  // OR when the update state is changed in mainContext
  useEffect(() => {
    loadMedia(0, 20);
  }, [update, searchValue, selectedPetType, mediaArray]);

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

  const putMedia = async (data, token, fileId) => {
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(data),
    };
    return await doFetch(`${baseUrl}media/${fileId}`, options);
  };

  return {
    mediaArray,
    postMedia,
    loading,
    getSingleMedia,
    deleteMedia,
    putMedia,
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

  return {getUserByToken, getUserById, postUser, checkUsername, putUser};
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

  const getTagsForFile = async (fileId, token) => {
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${baseUrl}tags/file/${fileId}`, options);
  };

  return {postTag, getFilesByTag, getTagsForFile};
};

const useFavourite = () => {
  const {update} = useContext(MainContext);
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

export {useMedia, useLogin, useUser, useTag, useFavourite};
