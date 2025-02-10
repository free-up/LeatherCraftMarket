import { TbTruckDelivery, TbMail, TbBrandYandex, TbShoppingCart } from "react-icons/tb";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Доставка</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2">
              <TbTruckDelivery className="w-8 h-8 text-[#0066B4]" />
              <span className="text-sm">СДЭК</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TbMail className="w-8 h-8 text-[#FF0000]" />
              <span className="text-sm">Почта России</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TbBrandYandex className="w-8 h-8 text-[#FF0000]" />
              <span className="text-sm">Яндекс.Доставка</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TbShoppingCart className="w-8 h-8 text-[#00AAFF]" />
              <span className="text-sm">Авито</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}