import { createClient } from "@/app/utils/supabase/server";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; productname: string }>;
}) {
  console.log(await params);
  const supabase = await createClient();
  const productName = decodeURIComponent((await params).productname);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_name", productName);

  if (error) {
    console.error(error);
  }
  if (data) {
    console.log(data);
  }

  return (
    <>
      <div className="w-full h-[18vh] bg-amber-600 "></div>
       {/* Mobile Layout (0px - 767px) */}
       <div className="block md:hidden">
         <div className="w-full min-h-screen bg-gray-50 p-2 flex flex-col gap-2">
           {/* Product Images Section */}
           <div className="w-full flex flex-col items-center justify-center gap-2">
             <div className="w-80 h-80 max-w-[90vw] max-h-[40vh] bg-amber-300 rounded-lg"></div>
             <div className="w-full flex flex-row justify-center gap-1">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="w-10 h-10 bg-gray-800 rounded-lg"></div>
               ))}
             </div>
           </div>

           {/* Content Section */}
           <div className="w-full pt-2 flex flex-col items-center gap-3 box-border">
             <div className="w-full text-start">
               <span className="text-2xl font-bold">Jewellery Name</span>
             </div>
             <div className="w-full text-start">
               <span className="text-lg font-bold">review</span>
             </div>
             <div className="w-full text-start">
               <span className="text-lg font-bold">price</span>
             </div>

             <div className="w-full flex flex-row items-center justify-center">
               <button className="w-[100%] h-12 text-lg font-bold bg-amber-800 rounded-lg">
                 Add to Cart
               </button>
             </div>
             <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
             <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
             <div className="w-full flex flex-col items-start justify-start gap-3">
               <span className="text-lg font-bold">size</span>
               <div className="w-full flex flex-row items-center justify-start gap-2">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-10 h-10 bg-gray-600 rounded-lg"></div>
                 ))}
                 <div className="w-1/2 h-10 border-2 border-gray-600 rounded-lg text-center items-center justify-center flex">
                   <span className="text-lg font-bold">Stock Status</span>
                 </div>
               </div>
             </div>
             <div className="w-full flex flex-row items-center justify-center">
               <button className="w-[100%] h-12 text-lg font-bold bg-amber-800 rounded-lg">
                 Add to Cart
               </button>
             </div>
             <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
             <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
           </div>

           {/* Additional Sections */}
           <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
           <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
           <div className="w-full h-16 flex flex-row bg-gray-300 items-center justify-center"></div>
         </div>
       </div>

       {/* Tablet Layout (768px - 1365px) */}
       <div className="hidden md:block xl:hidden">
         <div className="w-full min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
           {/* Product Images Section */}
           <div className="w-full h-[45vh] flex flex-row items-center justify-center gap-3">
             <div className="p-3 flex flex-col gap-3">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="w-16 h-16 bg-gray-800 rounded-lg"></div>
               ))}
             </div>
             <div className="w-[70%] h-full bg-amber-300 rounded-lg"></div>
           </div>

           {/* Content Section */}
           <div className="w-full h-[35vh] pt-6 flex flex-col items-center gap-5 box-border [&>*]:flex-shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             <div className="w-full text-start">
               <span className="text-3xl font-bold">Jewellery Name</span>
             </div>
             <div className="w-full text-start">
               <span className="text-xl font-bold">review</span>
             </div>
             <div className="w-full text-start">
               <span className="text-xl font-bold">price</span>
             </div>

             <div className="w-full flex flex-row items-center justify-center">
               <button className="w-[70%] h-14 text-xl font-bold bg-amber-800 rounded-lg">
                 Add to Cart
               </button>
             </div>
             <div className="w-full h-20 flex flex-row bg-gray-300 items-center justify-center"></div>
             <div className="w-full h-20 flex flex-row bg-gray-300 items-center justify-center"></div>
             <div className="w-full h-20 flex flex-col items-start justify-start gap-3">
               <span className="text-xl font-bold">size</span>
               <div className="w-full flex flex-row items-center justify-start gap-3">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-12 h-12 bg-gray-600 rounded-lg"></div>
                 ))}
                 <div className="w-1/2 h-12 border-2 border-gray-600 rounded-lg text-center items-center justify-center flex">
                   <span className="text-xl font-bold">Stock Status</span>
                 </div>
               </div>
             </div>
             <div className="w-full flex flex-row items-center justify-center">
               <button className="w-[70%] h-14 text-xl font-bold bg-amber-800 rounded-lg">
                 Add to Cart
               </button>
             </div>
             <div className="w-full h-20 flex flex-row bg-gray-300 items-center justify-center"></div>
             <div className="w-full h-20 flex flex-row bg-gray-300 items-center justify-center"></div>
           </div>

           {/* Additional Sections */}
           <div className="w-full h-[25vh] flex flex-row bg-gray-300 items-center justify-center"></div>
           <div className="w-full h-[25vh] flex flex-row bg-gray-300 items-center justify-center"></div>
           <div className="w-full h-[25vh] flex flex-row bg-gray-300 items-center justify-center"></div>
         </div>
       </div>

       {/* Desktop Layout (1366px+) */}
       <div className="hidden xl:flex flex-col justify-center items-start w-screen gap-8 pt-4 ">
        <div className="flex justify-center items-start w-screen gap-4 pt-4">
            <div className="w-[50%] h-[80vh]  flex flex-row items-center justify-center gap-4 ">
              <div className="p-4 flex flex-col gap-4  ">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-24 h-24 bg-gray-800 rounded-lg"></div>
                ))}
              </div>
              <div className="w-[70%] h-[100%] bg-amber-300 rounded-lg  "></div>
            </div>
              <div className="w-[30%] h-[80vh] pt-8 flex flex-col items-center gap-6 box-border [&>*]:flex-shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="w-full text-start ">
                <span className="text-4xl font-bold">Jewellery Name</span>
              </div>
              <div className="w-full text-start ">
                <span className="text-2xl font-bold">review</span>
              </div>
              <div className="w-full text-start ">
                <span className="text-2xl font-bold">price</span>
              </div>
    
              <div className="w-full flex flex-row items-center justify-center ">
                <button className="w-[100%] h-16 text-2xl font-bold bg-amber-800 rounded-lg">
                  Add to Cart
                </button>
              </div>
              <div className="w-full h-26 flex flex-row bg-gray-300 items-center justify-center  "></div>
              <div className="w-full h-26 flex flex-row bg-gray-300 items-center justify-center  "></div>
              <div className="w-full h-26 flex flex-col items-start justify-start gap-4  ">
                <span className="text-2xl font-bold">size</span>
                <div className="w-full flex flex-row items-center justify-start gap-4  ">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-14 h-14 bg-gray-600 rounded-lg"></div>
                  ))}
                  <div className="w-1/2 h-14 border-2 border-gray-600 rounded-lg text-center items-center justify-center flex "><span className="text-2xl font-bold">Stock Status</span></div>
                </div>
              </div>
              <div className="w-full flex flex-row items-center justify-center ">
                <button className="w-[100%] h-16 text-2xl font-bold bg-amber-800 rounded-lg">
                  Add to Cart
                </button>
              </div>
              <div className="w-full h-26 flex flex-row bg-gray-300 items-center justify-center  ">
    
              </div>
              <div className="w-full h-26 flex flex-row bg-gray-300 items-center justify-center  ">
                
              </div>
            </div>
        </div>
        <div className="w-full h-[40vh] flex flex-row bg-gray-300 items-center justify-center  "></div>
        <div className="w-full h-[40vh] flex flex-row bg-gray-300 items-center justify-center  "></div>
        <div className="w-full h-[40vh] flex flex-row bg-gray-300 items-center justify-center  "></div>
        
      </div>
    </>
  );
}
