import { AnyArray } from "@/types";
import { generatePaginationButtons } from "hooks/usePagination/generate-pagination-buttons";

export const pagination = <TArray extends AnyArray>({ data, pageSize, page, siblings }) => {
  const totalItems = data?.length ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginated = data?.slice((page - 1) * pageSize, page * pageSize);
  const pages = generatePaginationButtons({
    page,
    siblings,
    totalPages,
  });

  return {
    totalItems,
    totalPages,
    paginated,
    pages,
  };
};
