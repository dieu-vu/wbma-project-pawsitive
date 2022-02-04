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

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update} = useContext(MainContext);

  const loadMedia = async (start = 0, limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}tags/${appId}`);
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        const json = await response.json();
        const media = await Promise.all(
          json.map(async (item) => {
            const responseMedia = await fetch(baseUrl + 'media/' + item.file_id)
            const mediaData = await responseMedia.json();
            return mediaData;
          })
        );
        setMediaArray(media);
        console.log('mediaArray', mediaArray);
      }
    } catch (e) {
      console.log('loading media error', e.message);
    } finally {
      setLoading(false)
    }

  };
  // Call loadMedia() only once when the component is loaded
  // OR when the update state is changed in mainContext
  useEffect(() => {
    loadMedia(0,20);
  }, [update]);

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

  return {mediaArray, postMedia, loading};
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
    return await doFetch(baseUrl + 'users/user', options)
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
    const result = await doFetch(baseUrl + 'users/username/' + username)
    return result.available
  }

  return {getUserByToken, postUser, checkUsername, putUser}
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
    }
    return await doFetch(baseUrl + 'tags/', options);
  }

  const getFilesByTag = async (tag) => {
    return await doFetch(baseUrl + 'tags/' + tag)
  }

  return {postTag, getFilesByTag}
}

export {
  useMedia,
  useLogin,
  useUser,
  useTag,
}
