import axiosClient from "./axiosClient";

const categoryApi = {
  getParent: () => {
    const url = '/categories/parent';
    return axiosClient.get(url);
  },

  getSub: (parentId) => {
    const url = `/categories/sub/${parentId}`;
    return axiosClient.get(url);
  },

}

export default categoryApi;
