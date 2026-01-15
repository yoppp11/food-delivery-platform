import z from "zod";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export const UpdateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type UpdateLocation = z.infer<typeof UpdateLocationSchema>;
