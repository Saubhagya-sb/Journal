import Link from "next/link";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { ArrowLeftFromLine } from "lucide-react";
export default function collectionLayout({children}){
    return(
        <div className="container mx-auto px-4 py-8">
            <div >
                <Link href="/dashboard" className="text-sm text-orange-400 hover:text-orange-600 cursor-pointer">
                    <div className="flex gap-2"><ArrowLeftFromLine/>
                          <span className="mt-0.5">Back to dashboard</span>  
                    </div>
                                    </Link>
            </div>
            <Suspense fallback={<BarLoader color="orange" width={"100%"}/>}>{children}</Suspense>
            </div>
    )
}