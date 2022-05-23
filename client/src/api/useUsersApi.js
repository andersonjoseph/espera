import { ApiClient } from './ApiClient';

export function useUsersApi() {
  return {
    getUsers: async () => (await ApiClient.instance.get('users')).data,
    exportUsers: async (waitlist) =>
      (
        await ApiClient.instance.get('users/export', {
          responseType: 'blob',
	  params: {waitlist}
        })
      ).data,
    getUsersByWaitlist: async (waitlist) =>
      (
        await ApiClient.instance.get('users', {
          params: { waitlist },
        })
      ).data,
    getUser: async (id) => (await ApiClient.instance.get(`users/${id}`)).data,
    createUser: async (data) =>
      (await ApiClient.instance.post('users', data)).data,
    updateUser: async (id, data) =>
      (await ApiClient.instance.patch(`users/${id}`, data)).data,
    deleteUser: async (id) =>
      (await ApiClient.instance.delete(`users/${id}`)).data,
  };
}
