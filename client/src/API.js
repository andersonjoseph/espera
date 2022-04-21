import axios from 'axios';

export async function getUsers(_page = 1) {
  const res = await axios.get('users', {
    params: {
      _page,
    },
  });

  return res.data;
}
