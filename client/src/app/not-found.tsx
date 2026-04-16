import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex justify-center items-center md:py-34.5 md:gap-12">
      <div className="md:inline-block hidden">
        <Image
          src="https://i.pinimg.com/originals/96/ca/12/96ca124c67da7f640713a950ff8ee0a7.gif"
          width={400}
          height={400}
          alt="Not Found" 
        /> 
      </div> 

      <span className="h-96 w-px bg-gray-500/40 md:block hidden"></span>

      <div className="flex flex-col items-center gap-4 text-center md:px-0 md:py-0 px-8 py-12">

        <p className="md:text-9xl text-7xl font-extrabold text-indigo-600 animate-pulse">
          404
        </p>

        <h1 className="mt-4 md:text-3xl text-lg font-bold tracking-tight text-slate-900 dark:text-indigo-500 sm:text-5xl">
          Oops! Trang lỗi mất tiêu rồi.
        </h1>
        
        <p className="mt-6 md:text-base text-sm leading-7 text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc không tồn tại. Hãy quay lại trang chủ và thử lại nhé!
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 md:px-5 px-3 md:py-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-150 ease-in-out"
          >
            Quay lại Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}