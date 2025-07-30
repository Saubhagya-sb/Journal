"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import testimonials from '@/data/testimonial'
import { Card, CardContent } from './ui/card'
const TestimonialCarousel = () => {
  console.log(testimonials);
  
  return (
    <div >
      <h2 className='text-white text-3xl text-bold mb-12'>What our writers say:</h2>
      <Carousel
      plugins={[
        Autoplay({
          delay: 3500,
        }),
      ]}
    >
      <CarouselContent>
        {testimonials.map((testimonial,index)=>(
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className={`bg-white backdrop-blur-sm border-orange-400`}>
              <CardContent>
                <blockquote className='space-y-6'>
                  <p className='text-gray-700 italic'>
                    "{testimonial.text}"
                  </p>
                  <footer>
                    <div className='font-semibold text-orange-800'>-{testimonial.author}</div>
                    <div className='text-orange-800 italic'>-{testimonial.role}</div>
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    </div>
  )
}

export default TestimonialCarousel
