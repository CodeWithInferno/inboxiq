// components/TestimonialSlider.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

const testimonials = [
    {
        name: 'Jane D',
        role: 'CEO',
        feedback: 'The user interface of this pagedone is so intuitive, I was able to start using it without any guidance.',
        image: '/Deep Purple.jpg',
        rating: 5,
    },
    {
        name: 'Harsh P.',
        role: 'Product Designer',
        feedback: 'I used to dread doing my taxes every year, but pagedone has made the process so much simpler and stress-free.',
        image: '/Deep Purple.jpg',
        rating: 5,
    },
    {
        name: 'Harsh P.',
        role: 'Product Designer',
        feedback: 'I used to dread doing my taxes every year, but pagedone has made the process so much simpler and stress-free.',
        image: '/Deep Purple.jpg',
        rating: 5,
    },
];

const TestimonialSlider = () => {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center lg:justify-between items-center gap-y-8 flex-wrap lg:flex-nowrap max-w-sm sm:max-w-2xl lg:max-w-full mx-auto">
                    <div className="w-full lg:w-2/5">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4 block">Testimonial</span>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-[3.25rem] mb-8">
                            23k+ Customers gave their <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-violet-600">Feedback</span>
                        </h2>
                    </div>
                    <div className="w-full ml-5 lg:w-3/5">
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                            }}
                            className="pb-10" // Add padding to prevent overlap with dots
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide 
                                    key={index} 
                                    className="group bg-white dark:bg-[#2e2e3e] border border-gray-300 dark:border-gray-600 rounded-2xl max-w-[280px] max-h-[300px] p-4 transition-all duration-500 hover:border-indigo-600 shadow-md mx-auto"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <Image className="rounded-full object-cover" src={testimonial.image} alt={testimonial.name} width={40} height={40} />
                                        <div className="grid gap-1">
                                            <h5 className="text-gray-900 dark:text-white font-bold text-sm">{testimonial.name}</h5>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-3 text-yellow-400">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 .587l3.668 7.431 8.207 1.195-5.938 5.788 1.402 8.169-7.339-3.856L4.662 23.17l1.402-8.169L.126 9.213l8.207-1.195z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-5 group-hover:text-gray-800 dark:group-hover:text-gray-100">{testimonial.feedback}</p>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;









