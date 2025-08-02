import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Book, Calendar, ChevronLeft, ChevronRight, FileTextIcon, Lock, Sparkles , BarChart2 } from 'lucide-react'
import Link from 'next/link'
import TestimonialCarousel from '@/components/testimonial-carousel'
import faqs from '@/data/faqs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React from 'react'
import { getDailyPrompt } from '@/actions/public'
const features = [
    {
        icon: Book,
        title: "Rich Text Editor",
        description:
        "Express yourself with a powerful editor supporting markdown , formatting and more."
    },
    {
        icon: Sparkles,
        title: "Daily Inspiration",
        description:
        "Get inspired with daily prompts and mood-based imagery to spark your creativity"
    },
    {
        icon: Lock,
        title: "Secure and Private",
        description:
        "Your journals are safe with enterprise-grade security and privacy features"
    }
]
export default async function Home(){
    const advice = await getDailyPrompt()
    
    
    return(
        <div className='relative container mx-auto px-4 pt-16 pb-16'>
            <div className='max-w-5xl mx-auto text-center space-y-8'>
                <h1 className='font-black text-orange-400 text-5xl md:text-7xl lg:text-8xl mb-6'>
                    Every New Day is <br/> A New You 
                </h1>
                <p className='text-lg md:text-xl text-yellow-200 mb-8'>
                    Capture your thoughts ,track your moods ,and reflect on your journey in a beautiful ,secure space.
                </p>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent pointer-events-none z-10'/>
                  <div className='bg-white rounded-2xl p-4 max-h-full mx-auto'>
                        <div className='border-b border-orange-100 pb-4 mb-4 flex justify-between items-center'>
                            <div className='flex items-center  gap-2'>
                            <Calendar className='h-5 w-5 text-orange-600'/>
                            <span className='font-medium text-orange-900'>Today's Entry</span>
                            </div>
                            <div className='flex gap-2'>
                                <div className='h-3 w-3 rounded-full bg-orange-200'/>
                                <div className='h-3 w-3 rounded-full bg-orange-300'/>
                                <div className='h-3 w-3 rounded-full bg-orange-400'/>
                            </div>

                           
                        </div>
                         <div className='space-y-4 p-4'>
                                <h3 className='text-xl font-semibold text-orange-800'>{advice?advice:"My thoughts today"}</h3>
                                <Skeleton className="h-4 bg-orange-100 rounded w-3/4"/>    
                                <Skeleton className="h-4 bg-orange-100 rounded w-full"/>    
                                <Skeleton className="h-4 bg-orange-100 rounded w-2/3"/>    
                            </div>    
                  </div>
                </div>
                <div className='flex justify-center gap-4'>
                    <Link href="/dashboard">
                        <Button variant="journal" className="px-8 pu-6 rounded-full flex items-center gap-2">
                            Start Creating
                            <ChevronRight className='h-5 w-5'/>
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" className="px-8 py-6 rounded-full border-orange-600 text-orange-600
                        hover:bg-orange-100">
                            Learn More
                        </Button>
                    </Link>
                </div>
                <div/>
                <section id="features" className='mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {features.map((feature,index)=>(
                         <Card key={index} className="shadow-lg">
                            <CardContent className="p-6">
                                <div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                                    <feature.icon className='h-6 w-6 text-orange-600'/>
                                </div>
                                <h3 className='font-semibold text-orange-900 text-xl mb-2'>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </CardContent>
                         </Card>   
                    ))}    
                </section>
                <div className='space-y-24 mt-24'>
                    <div className='grid md:grid-cols-2 gap-12'>
                       <div className="p-4 space-y-3 flex flex-col items-start">
                            <div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center'>
                                <FileTextIcon className='h-6 w-6 text-orange-600' />
                            </div>

                            <h3 className='text-2xl font-semibold text-yellow-300'>Rich Text Editor</h3>

                            <p className='text-white'>
                                Express yourself fully with our powerful editor featuring:
                            </p>

                            <ul className='space-y-2'>
                                <li className='flex items-center gap-2'>
                                <div className='h-2 w-2 bg-orange-500 rounded-full' />
                                <span className='text-white'>Format text with ease</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                <div className='h-2 w-2 bg-orange-500 rounded-full' />
                                <span className='text-white'>Embed links</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                <div className='h-2 w-2 bg-orange-500 rounded-full' />
                                <span className='text-white'>Save drafts of your journal</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                            <div className='flex gap-2 mb-6'>
                                <div className='rounded h-8 w-8 bg-orange-100'/>
                                <div className='rounded h-8 w-8 bg-orange-200'/>
                                <div className='rounded h-8 w-8 bg-orange-300'/>
                            </div>
                            <Skeleton className="h-4 bg-orange-100 rounded w-3/4"/>
                            <Skeleton className="h-4 bg-orange-100 rounded w-full"/>
                            <Skeleton className="h-4 bg-orange-200 rounded w-2/3"/>
                            <Skeleton className="h-4 bg-orange-200 rounded w-full"/>
                        </div>
                    </div>
                    
                    <div className='grid md:grid-cols-2 gap-12'>
                       <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
                            <div className='flex gap-2 mb-6'>
                                <div className='rounded h-8 w-8 bg-orange-100'/>
                                <div className='rounded h-8 w-8 bg-orange-200'/>
                                <div className='rounded h-8 w-8 bg-orange-300'/>
                            </div>
                            <Skeleton className="h-4 bg-orange-100 rounded w-3/4"/>
                            <Skeleton className="h-4 bg-orange-100 rounded w-full"/>
                            <Skeleton className="h-4 bg-orange-200 rounded w-2/3"/>
                            <Skeleton className="h-4 bg-orange-200 rounded w-full"/>
                        </div>
                       <div className="p-4 space-y-3 flex flex-col items-start">
                            
                        
                            <div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center'>
                                <BarChart2 className='h-6 w-6 text-orange-600' />
                            </div>

                            <h3 className='text-2xl font-semibold text-yellow-300'>Mood Analytics</h3>

                            <p className='text-white'>
                                Track your emotional journey with powerful analytics:
                            </p>

                            <ul className='space-y-2'>
                                <li className='flex items-center gap-2'>
                                <div className='h-2 w-2 bg-orange-500 rounded-full' />
                                <span className='text-white'>Visual Mood Trends</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                <div className='h-2 w-2 bg-orange-500 rounded-full' />
                                <span className='text-white'>Pattern Recogntion</span>
                                </li>
                                
                            </ul>
                        </div>

                    </div>
                    
                    <TestimonialCarousel/>
                    <div>
                        <h2 className='text-white text-3xl font-bold'>
                            Frequently Asked Questions :
                        </h2>
                        <Accordion type="single" collapsible>
                            {/* <AccordionItem value="item-1">
                                <AccordionTrigger className={`text-white`}>Is it accessible?</AccordionTrigger>
                                <AccordionContent className={`text-white`}>
                                Yes. It adheres to the WAI-ARIA design pattern.
                                </AccordionContent>
                            </AccordionItem> */}
                            {faqs.map((faq,index)=>(
                                <AccordionItem value={index+1} key={index+1}>
                                    <AccordionTrigger className="text-white text-lg">{faq.q}</AccordionTrigger>
                                    <AccordionContent className="text-white ">{faq.a}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div>
                        <Card>
                            <CardContent>
                                <h2 className='text-3xl font-bold text-gray-600 mb-6'>Start reflecting on your journey today </h2>
                                <p className='text-lg text-gray-600 mt-6 mb-6 font-semibold'>
                                    Join the digital journaling wave now
                                </p>
                                <Link href="/dashboard">
                                    <Button size="lg" variant="journal2">
                                        Get Started for Free
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
