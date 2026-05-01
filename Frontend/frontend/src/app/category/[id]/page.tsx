"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubCategoryTabs from "@/components/category/SubCategoryTabs";
import ProductGrid from "@/components/category/ProductGrid";
import FilterSidebar from "@/components/category/FilterSidebar";
import Pagination from "@/components/category/Pagination";

import api from "@/services/api";
import { fetchProducts } from "@/services/product";
import { ProductListItem } from "@/types/product";
import toast from "react-hot-toast"; 

const LIMIT = 12;

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = params.id as string;

  const subCategoryId = searchParams.get("subCategory") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "price_asc";

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  // 🔥 FETCH SUBCATEGORIES
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await api.get(
          `/categories/subcategories?categoryId=${categoryId}`
        );

        const payload = res?.data ?? res;
        setSubcategories(payload.data || []);
      } catch (err) {
        console.error("Subcategory fetch failed", err);
        toast.error("Failed to load subcategories"); // ✅ added
      }
    };

    fetchSub();
  }, [categoryId]);

  // 🔥 RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setPage(1);
  }, [categoryId, subCategoryId, minPrice, maxPrice]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const params = new URLSearchParams();

        params.set("categoryId", categoryId);
        params.set("page", String(page));
        params.set("limit", String(LIMIT));

        if (subCategoryId !== "all") {
          params.set("subCategoryId", subCategoryId);
        }

        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (sortBy) params.set("sortBy", sortBy);

        const res = await fetchProducts(
          `/products/search?${params.toString()}`
        );

        const list = res.data;
        const pagination = res.pagination;

        setProducts(list);
        setTotalPages(pagination?.totalPages || 1);

        if (res.priceRange) {
          setPriceBounds([res.priceRange.min, res.priceRange.max]);
        }

        // ⚠️ optional — only if empty results
        if (list.length === 0) {
          toast("No products found for selected filters"); // subtle info
        }

      } catch (err) {
        console.error("Product fetch failed", err);
        toast.error("Failed to load products"); // ✅ added
      }
    };

    loadProducts();
  }, [categoryId, subCategoryId, minPrice, maxPrice, page, sortBy]);

  const handleSubChange = (subId: string) => {
    const query = new URLSearchParams(searchParams.toString());

    if (subId === "all") query.delete("subCategory");
    else query.set("subCategory", subId);

    router.push(`/category/${categoryId}?${query.toString()}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-20">
            <FilterSidebar priceBounds={priceBounds} />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Open Filters
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-4">Category</h1>

            <SubCategoryTabs
              subcategories={subcategories}
              active={subCategoryId}
              setActive={handleSubChange}
            />
          </div>

          <ProductGrid products={products} />

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showFilters ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowFilters(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full bg-white transform transition-transform duration-300 ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>✕</button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <FilterSidebar
              priceBounds={priceBounds}
              onApply={() => setShowFilters(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;


// "use client";

// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import SubCategoryTabs from "@/components/category/SubCategoryTabs";
// import ProductGrid from "@/components/category/ProductGrid";
// import FilterSidebar from "@/components/category/FilterSidebar";
// import Pagination from "@/components/category/Pagination";

// import api from "@/services/api";
// import { fetchProducts } from "@/services/product";
// import { ProductListItem } from "@/types/product";

// import toast from "react-hot-toast";

// const LIMIT = 12;

// const CategoryPage = () => {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // slug only for pretty URL
//   const categorySlug = params.slug as string;

//   // id still powers backend APIs
//   const categoryId = searchParams.get("id") as string;

//   const subCategoryId =
//     searchParams.get("subCategory") || "all";

//   const minPrice =
//     searchParams.get("minPrice") || "";

//   const maxPrice =
//     searchParams.get("maxPrice") || "";

//   const sortBy =
//     searchParams.get("sortBy") || "price_asc";

//   const [subcategories,setSubcategories] =
//     useState<any[]>([]);

//   const [products,setProducts] =
//     useState<ProductListItem[]>([]);

//   const [priceBounds,setPriceBounds] =
//     useState<[number,number]>([0,0]);

//   const [page,setPage] = useState(1);
//   const [totalPages,setTotalPages] = useState(1);

//   const [showFilters,setShowFilters] =
//     useState(false);


//   //---------------------------------------
//   // guard against missing id
//   //---------------------------------------

//   useEffect(() => {
//     if(!categoryId){
//       toast.error("Missing category");
//       return;
//     }
//   },[categoryId]);


//   //---------------------------------------
//   // fetch subcategories
//   //---------------------------------------

//   useEffect(() => {

//     if(!categoryId) return;

//     const fetchSub = async () => {
//       try{

//         const res = await api.get(
//           `/categories/subcategories?categoryId=${categoryId}`
//         );
//         console.log(res.data)
//         const payload = res?.data ?? res;

//         setSubcategories(
//           payload.data || []
//         );

//       } catch(err){
//         console.error(err);
//         toast.error(
//           "Failed to load subcategories"
//         );
//       }
//     };

//     fetchSub();

//   },[categoryId]);


//   //---------------------------------------
//   // reset pagination on filter change
//   //---------------------------------------

//   useEffect(() => {
//     setPage(1);
//   },[
//     categoryId,
//     subCategoryId,
//     minPrice,
//     maxPrice
//   ]);


//   //---------------------------------------
//   // fetch products
//   //---------------------------------------

//   useEffect(() => {

//     if(!categoryId) return;

//     const loadProducts = async () => {

//       try{

//         const query =
//           new URLSearchParams();

//         query.set(
//           "categoryId",
//           categoryId
//         );

//         query.set(
//           "page",
//           String(page)
//         );

//         query.set(
//           "limit",
//           String(LIMIT)
//         );

//         if(
//           subCategoryId !== "all"
//         ){
//           query.set(
//             "subCategoryId",
//             subCategoryId
//           );
//         }

//         if(minPrice){
//           query.set(
//             "minPrice",
//             minPrice
//           );
//         }

//         if(maxPrice){
//           query.set(
//             "maxPrice",
//             maxPrice
//           );
//         }

//         if(sortBy){
//           query.set(
//             "sortBy",
//             sortBy
//           );
//         }

//         const res = await fetchProducts(
//           `/products/search?${query.toString()}`
//         );

//         const list = res.data;
//         const pagination =
//           res.pagination;

//         setProducts(
//           list || []
//         );

//         setTotalPages(
//           pagination?.totalPages || 1
//         );

//         if(res.priceRange){
//           setPriceBounds([
//             res.priceRange.min,
//             res.priceRange.max
//           ]);
//         }

//         if(
//           list?.length === 0
//         ){
//           toast(
//             "No products found for selected filters"
//           );
//         }

//       } catch(err){
//         console.error(err);
//         toast.error(
//           "Failed to load products"
//         );
//       }

//     };

//     loadProducts();

//   },[
//     categoryId,
//     subCategoryId,
//     minPrice,
//     maxPrice,
//     page,
//     sortBy
//   ]);


//   //---------------------------------------
//   // preserve id when switching tabs
//   //---------------------------------------

//   const handleSubChange = (
//     subId:string
//   ) => {

//     const query =
//       new URLSearchParams(
//         searchParams.toString()
//       );

//     if(subId==="all"){
//       query.delete(
//         "subCategory"
//       );
//     }else{
//       query.set(
//         "subCategory",
//         subId
//       );
//     }

//     // keep category id in url
//     query.set(
//       "id",
//       categoryId
//     );

//     router.push(
//       `/category/${categorySlug}?${query.toString()}`
//     );
//   };


//   //---------------------------------------

//   useEffect(() => {
//     window.scrollTo({
//       top:0,
//       behavior:"smooth"
//     });
//   },[page]);


//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

//         {/* desktop filters */}
//         <div className="hidden lg:block w-64 xl:w-72 shrink-0">
//           <div className="sticky top-20">
//             <FilterSidebar
//               priceBounds={priceBounds}
//             />
//           </div>
//         </div>

//         <div className="flex-1 flex flex-col">

//           {/* mobile filters */}
//           <div className="lg:hidden mb-4">
//             <button
//               onClick={()=>
//                 setShowFilters(true)
//               }
//               className="w-full bg-black text-white py-2 rounded-lg"
//             >
//               Open Filters
//             </button>
//           </div>

//           <div className="mb-6">
//             <h1 className="text-2xl font-semibold mb-4 capitalize">
//               {categorySlug.replace(
//                 /-/g,
//                 " "
//               )}
//             </h1>

//             <SubCategoryTabs
//               subcategories={subcategories}
//               active={subCategoryId}
//               setActive={
//                 handleSubChange
//               }
//             />
//           </div>

//           <ProductGrid
//             products={products}
//           />

//           <Pagination
//             page={page}
//             totalPages={totalPages}
//             setPage={setPage}
//           />

//         </div>
//       </div>


//       {/* mobile drawer */}
//       <div
//         className={`fixed inset-0 z-50 transition-all duration-300 ${
//           showFilters
//           ? "visible opacity-100"
//           : "invisible opacity-0"
//         }`}
//       >

//         <div
//           className="absolute inset-0 bg-black/40"
//           onClick={()=>
//             setShowFilters(false)
//           }
//         />

//         <div
//           className={`absolute right-0 top-0 h-full w-full bg-white transform transition-transform duration-300 ${
//             showFilters
//             ? "translate-x-0"
//             : "translate-x-full"
//           }`}
//         >

//           <div className="flex items-center justify-between p-4 border-b">
//             <h2 className="text-lg font-semibold">
//               Filters
//             </h2>

//             <button
//               onClick={()=>
//                 setShowFilters(false)
//               }
//             >
//               ✕
//             </button>
//           </div>

//           <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
//             <FilterSidebar
//               priceBounds={priceBounds}
//               onApply={()=>
//                 setShowFilters(false)
//               }
//             />
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryPage;