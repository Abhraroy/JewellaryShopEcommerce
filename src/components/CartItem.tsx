import Image from "next/image";

interface CartItemProps {
  item: any;
  onDecrease: (item: any) => void;
  onIncrease: (item: any) => void;
  onRemove: (item: any) => void;
}

export default function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemProps) {
  const product = item?.products ?? item?.product ?? item;
  const productName = product?.product_name || product?.name || "Product";
  const productImage = product?.thumbnail_image || product?.image_url || null;
  const price = Number(product?.final_price ?? product?.price ?? 0);
  const quantity = Number(item?.quantity ?? 1);

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#FFCDC9] text-[#7A1C1C] rounded-xl hover:bg-[#FD7979] transition-colors duration-200">
      {/* Product Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-[#7A1C1C]/20">
        {productImage ? (
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
          />
        ) : (
          <div className="w-full h-full bg-[#FFE4E1]" />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-xs sm:text-sm font-semibold text-[#7A1C1C] line-clamp-2 mb-1 flex-shrink-0">
          {productName}
        </h3>
        <p className="text-base sm:text-lg font-bold text-[#7A1C1C] mb-2 sm:mb-3 flex-shrink-0">
          ₹{price}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mt-auto">
          <div className="flex items-center gap-0 border border-[#7A1C1C]/30 rounded-lg bg-white overflow-hidden">
            <button
              className="p-1 sm:p-1.5 text-[#7A1C1C] hover:text-[#7A1C1C] hover:bg-[#FD7979] transition-colors duration-200 
                              disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0
                              "
              disabled={quantity === 1}
              aria-label="Decrease quantity"
              onClick={() => onDecrease(item)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-[#7A1C1C] min-w-[2.5rem] sm:min-w-[3rem] text-center tabular-nums flex-shrink-0">
              {quantity}
            </span>
            <button
              className="p-1 sm:p-1.5 text-[#7A1C1C] hover:text-[#7A1C1C] hover:bg-[#FD7979] transition-colors duration-200 flex-shrink-0"
              aria-label="Increase quantity"
              onClick={() => onIncrease(item)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          {/* Remove Button */}
          <button
            className="p-1 sm:p-1.5 text-[#7A1C1C] hover:text-[#B03030] hover:bg-[#FD7979] rounded transition-colors duration-200 flex-shrink-0"
            aria-label="Remove item"
            onClick={() => onRemove(item)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

