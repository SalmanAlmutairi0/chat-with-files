import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden ">
      {/* hero */}
      <div className="container mx-auto h-screen max-h-[80%] relative">
        <div className="absolute -z-10 -top-24 -left-36 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -z-10 -bottom-20 -right-36 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -z-10 top-1/2 left-1/2 w-48 h-48 bg-blue-300 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="flex flex-col justify-center items-center gap-4 mt-32">
          <h1 className="text-4xl font-semibold">
            تواصل مع ملفاتك بسهولة باستخدام{" "}
            <span
              className="
            relative inline-block
            after:content-[''] 
            after:absolute 
            after:-bottom-5
            after:left-0 
            after:w-full 
            after:h-[0.2em] 
            after:bg-primary 
            after:-rotate-3 
            after:origin-left
            after:rounded-md
            
            "
            >
              الذكاء الاصطناعي
            </span>
          </h1>
          <p className="text-lg text-gray-500 text-center max-w-lg">
            قم برفع ملف PDF الخاص بك بسهولة وابدأ رحلة التفاعل مع محتواه.
            استخرج المعلومات القيمة واكتشف الأفكار الجديدة بأسلوب مبتكر وسلس.
          </p>
        </div>
      </div>
    </div>
  );
}
