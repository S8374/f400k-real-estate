import { baseApi } from "./baseApi";

export const zoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createZone: builder.mutation({
      query: (data) => ({
        url: "/zones",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Zones" as any],
    }),
    getAllZones: builder.query({
      query: () => ({
        url: "/zones",
        method: "GET",
      }),
      providesTags: ["Zones" as any],
    }),
    updateZone: builder.mutation({
      query: ({ id, data }) => ({
        url: `/zones/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Zones" as any],
    }),
    deleteZone: builder.mutation({
      query: (id) => ({
        url: `/zones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Zones" as any],
    }),
  }),
});

export const {
  useCreateZoneMutation,
  useGetAllZonesQuery,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = zoneApi;
