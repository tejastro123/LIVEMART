import React, { useState, useEffect } from 'react';

const Countdown = ({ expiryDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(expiryDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && interval !== 'seconds' && interval !== 'minutes') { // Don't show 0 days/hours
        return;
        }
        timerComponents.push(
        <span key={interval}>
            {timeLeft[interval]} {interval}{" "}
        </span>
        );
    });

    return (
        <div className="countdown-timer">
        {timerComponents.length ? timerComponents : <span>Deal Expired!</span>}
        </div>
    );
};

export default Countdown;