import { ApiClient } from './ApiClient';

export function useWaitlistApi() {
  return {
    getWaitlists: async () => (await ApiClient.instance.get('waitlists')).data,
    getWaitlist: async (id) =>
      (await ApiClient.instance.get(`waitlists/${id}`)).data,
    createWaitlist: async (data) =>
      (await ApiClient.instance.post('waitlists', data)).data,
    updateWaitlist: async (id, data) =>
      (await ApiClient.instance.patch(`waitlists/${id}`, data)).data,
    deleteWaitlist: async (id) =>
      (await ApiClient.instance.delete(`waitlists/${id}`)).data,
  };
}
