import React, { useEffect, useRef } from 'react';

// Counter component that animates counting from 0 to the specified end value over a duration
const Counter = ({ end, duration }) => {
    // useRef is used to reference the DOM element that displays the counter value
    const ref = useRef(null);

    // useEffect hook to handle the counting animation and intersection observer logic
    useEffect(() => {
        let start = 0; // Initialize the start value of the counter
        const element = ref.current; // Reference to the DOM element
        // Calculate the increment value based on the duration and the end value
        const increment = end / (duration / 16.666); // 16.666ms approximates one frame at 60fps

        // Function to increment the counter value and update the DOM element
        const countUp = () => {
            start += increment; // Increment the counter value
            if (start < end) {
                element.innerText = Math.ceil(start); // Update the element with the incremented value
                requestAnimationFrame(countUp); // Request the next animation frame to continue counting
            } else {
                element.innerText = end; // Set the final value once the end value is reached
            }
        };

        // Intersection Observer callback to start counting when the element is in view
        const handleObserver = (entries) => {
            const [entry] = entries; // Get the first entry (there's only one observed element)
            if (entry.isIntersecting) {
                // If the element is in view
                requestAnimationFrame(countUp); // Start the counting animation
            }
        };

        // Create an Intersection Observer to observe when the element is in view
        const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
        observer.observe(element); // Start observing the element

        // Clean up the observer when the component unmounts or dependencies change
        return () => {
            observer.disconnect(); // Disconnect the observer
        };
    }, [end, duration]); // Dependencies array, re-run effect if end or duration changes

    // Render the counter element with a ref
    return <div className={`font-bold text-5xl  lg:text-6xl `} ref={ref}>0</div>;
};

export default Counter;




// let start = null;
// const element = document.getElementById("animatedElement");

// function step(timestamp) {
//   if (!start) start = timestamp;
//   const progress = timestamp - start;
//   element.style.transform = 'translateX(' + Math.min(progress / 10, 200) + 'px)';
//   if (progress < 2000) { // Stop the animation after 2000ms
//     requestAnimationFrame(step);
//   }
// }

// requestAnimationFrame(step);