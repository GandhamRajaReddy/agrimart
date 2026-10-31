import axiosClient from "../../../services/http/axiosClient";
import { homeContent } from "../data/homeContent";

const asList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export const homeApi = {
  async getLandingPage() {
    const [categoriesResult, productsResult] = await Promise.allSettled([
      axiosClient.get("/categories/"),
      axiosClient.get("/products/featured/"),
    ]);

    const categories =
      categoriesResult.status === "fulfilled"
        ? asList(categoriesResult.value.data)
        : [];
    const featuredProducts =
      productsResult.status === "fulfilled"
        ? asList(productsResult.value.data)
        : [];

    return {
      ...homeContent,
      categories: categories.length ? categories : homeContent.categories,
      featuredProducts: featuredProducts.length
        ? featuredProducts
        : homeContent.featuredProducts,
    };
  },
};
