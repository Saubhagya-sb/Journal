// app/not-found.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    
     


        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white text-gray-800">
                <h1 className="text-6xl font-bold text-orange-500">404</h1>
                <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
                <p className="mt-2 max-w-md text-gray-600">
                        Oops! The page you are looking for doesn’t exist or has been moved.
                </p>
                <Link href="/" passHref>
                    <Button variant="journal" className="mt-6">
                        Return Home
                     </Button>
                </Link>
        </div>
   
    
  )
}

