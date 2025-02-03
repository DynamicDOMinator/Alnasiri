import Image from "next/image";
import Link from "next/link";
export default function Notifications() {
  return (



<div className="bg-slate-100 pt-24 pb-10  px-4">
<div className ="max-w-7xl mx-auto">
<h1 className="lg:text-3xl text-xl font-bold text-right">الاشعارات</h1>


<div dir="rtl" className=" flex md:flex-row flex-col md:items-start items-center mt-10 gap-10 justify-between ">
   
    <div className="flex items-start gap-2 w-full md:w-auto p-4 bg-white lg:w-2/3">
        
        <div>
        <Image
        src={"/images/lookingFor4.png"}
        alt="lawyer"
        width={100}
        height={100}
        />
        </div>
        <div>
            <p className="text-lg font-bold">لقد تمت الاجابة على سؤالك</p>
            <p className="mt-2">محامي موثوق ومجتهد عن تجربة العملاء</p>
            <p className="mt-2">20/10/2024</p>
        </div>
        
        
        
        
        
        </div> 
    <div className="border-t-4 lg:w-1/3  w-full md:w-auto border-blue-800 pb-5 bg-white p-2 flex flex-col items-center">
    <h2 className="text-lg font-bold mt-2">
        أسأل سؤال مجاني 
    </h2>
    <p className="text-gray-800 mt-2">اطرح سؤالاً واحصل على مشورة مجانية من عدة محامين</p>
    <button className="bg-blue-800 mt-10 hover:bg-blue-900 text-white px-4 py-2 rounded">
        <Link href="/Askquestion">
        اسأل سؤال مجاني
        </Link>
    </button>
    </div>
</div>


</div>

</div>


  );
}
