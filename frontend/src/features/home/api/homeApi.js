import axiosClient from "../../../services/http/axiosClient";
import { homeContent } from "../data/homeContent";

export const homeApi = {
  async getLandingPage({ locale } = {}) {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axiosClient.get("/categories/"),
        axiosClient.get("/products/featured/"),
      ]);

      const categories = categoriesRes.data?.length ? categoriesRes.data : homeContent.categories;
      const featuredProducts = productsRes.data?.length ? productsRes.data : homeContent.featuredProducts;

      return {
        ...homeContent,
        categories,
        featuredProducts,
      };
    } catch (error) {
      console.warn("[homeApi] Live Django API fallback to local content:", error.message);
      return homeContent;
    }
  },
};
