import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import './caro.css';
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './EmblaButtons'
import { HeroSlides} from 'utils/Pageutils'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function HeroSlideShow(props) {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 15000,duration:1 })
    ])
    const [isPlaying, setIsPlaying] = useState(true)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const onButtonAutoplayClick = useCallback(
        (callback) => {
            const autoplay = emblaApi?.plugins()?.autoplay
            if (!autoplay) return

            const resetOrStop =
                autoplay.options.stopOnInteraction === false
                    ? autoplay.reset
                    : autoplay.stop

            resetOrStop()
            callback()
        },
        [emblaApi]
    )

    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
        playOrStop()
    }, [emblaApi])

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        setIsPlaying(autoplay.isPlaying())
        emblaApi
            .on('autoplay:play', () => setIsPlaying(true))
            .on('autoplay:stop', () => setIsPlaying(false))
            .on('reInit', () => setIsPlaying(autoplay.isPlaying()))
    }, [emblaApi])


    return (
        <div className="carousel_embla overflow-hidden  w-full" ref={emblaRef}>
            <div className="carousel_embla__container w-[105%] px-2  mx-auto flex ">
                {HeroSlides.map((item, index) => (
                    <div className='carousel_embla__slide w-full  ' key={index}>
                        <div 
                        className="w-full flex items-start flex-col pr-3 lg:flex-row justify-between gap-10 ">
                            <div className=" flex items-start flex-col gap-4 lg:w-1/2 w-full ">
                                <motion.div 
                                initial={{opacity:0, y:-200}}
                                animate={{opacity:1, y:0}}
                                transition={{delay:0.7, duration:1}}
                                className="text-sec font-bold test-lg capitalize">{item.tip}
                                </motion.div>


                                <motion.div 
                                initial={{opacity:0, y:-200}}
                                animate={{opacity:1, y:0}}
                                transition={{delay:0.6, duration:0.8}}
                                className=" w-fit capitalize space-x-2 font-bold text-4xl lg:text-5xl ">{item.title}
                                </motion.div>


                                <motion.div
                                initial={{opacity:0, y:-200}}
                                animate={{opacity:1, y:0}}
                                transition={{delay:0.5, duration:0.7}} 
                                className="text-base">{item.content}</motion.div>
                                <motion.div 
                                initial={{opacity:0, y:-200}}
                                animate={{opacity:1, y:0}}
                                transition={{delay:0.4, duration:0.6}}
                                className="flex items-center gap-2">
                                    <Link className='poppins font-semibold w-fit px-3 py-2 rounded-md bg-sec text-white' to={`/signup`}>Create Account</Link>
                                    <Link className='poppins font-semibold w-fit px-3 py-2 rounded-md bg-orange-500 text-white' to={`/login`}>Send money now</Link>
                                </motion.div>
                            </div>
                            <motion.div  
                            initial={{opacity:0, y:-200}}
                            animate={{opacity:1, y:0}}
                            transition={{delay:0.7, duration:1}}
                            className="lg:w-1/2 w-full relative lg:mr-10 ">
                                <div className="absolute lg:top-20 top-16 right-8 lg:right-20 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full after:absolute after:top-0 after:left-0 conte"></div>
                                <img src={item.img} className="w-fit mx-auto h-[20rem] lg:h-[35rem] rounded-md object-cover" alt={`hero image ${index}`} loading='lazy'/>
                                <div className="absolute bottom-2 left-20 lg:bottom-8 lg:left-32 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full"></div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>

            <div className=" w-11/12 mx-auto  ">
                <div className=" w-full  flex items-center justify-between">
                    <PrevButton
                        onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={() => onButtonAutoplayClick(onNextButtonClick)}
                        disabled={nextBtnDisabled}
                    />
                </div>

            </div>
        </div>
    )
}

