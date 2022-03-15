import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
  "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,

  "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
};

const createRequest = (url) => ({
  url,
  headers: cryptoApiHeaders,
});
// Define a sevice with using a base URL and expected endpoints
export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins?limit=${count}`),
    }),
    getCryptosDetails: builder.query({
      query: (coinId) => createRequest(`/coin/${coinId}`),
    }),
    getCryptoHistory: builder.query({
      query: ({ coinId, timePeriod }) =>
        createRequest(`/coin/${coinId}/history?timePeriod=${timePeriod}`),
    }),
  }),
});

//export hooks for usage in functional components
export const {
  useGetCryptosQuery,
  useGetCryptosDetailsQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;
