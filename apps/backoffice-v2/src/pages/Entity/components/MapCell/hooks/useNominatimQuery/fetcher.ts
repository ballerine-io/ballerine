import { handlePromise } from '@ballerine/common';
import { fetcher } from '../../../../../../common/utils/fetcher/fetcher';
import { Method } from '../../../../../../common/enums';
import { z } from 'zod';
import { handleZodError } from '../../../../../../common/utils/handle-zod-error/handle-zod-error';

export const fetchNominatimSearch = async ({
  country,
  city,
  street,
}: {
  country: string;
  city: string;
  street: string;
}) => {
  const [coordinates, error] = await handlePromise(
    fetcher({
      method: Method.GET,
      url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        `${country} ${city} ${street}`,
      )}&format=json`,
      schema: z.array(
        z.object({
          lat: z.coerce.number(),
          lon: z.coerce.number(),
        }),
      ),
    }),
  );

  return handleZodError(error, coordinates);
};
