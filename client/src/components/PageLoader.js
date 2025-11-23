// client/src/components/PageLoader.js
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import the default CSS for the progress bar

const PageLoader = () => {
    useEffect(() => {
        // When the component mounts (i.e., when React is waiting for a page to load),
        // start the progress bar.
        NProgress.start();

        // The cleanup function: when the component unmounts (i.e., the page has
        // finished loading), stop the progress bar.
        return () => {
        NProgress.done();
        };
    }, []); // The empty dependency array ensures this runs only once on mount/unmount

    // This component doesn't render any visible HTML itself.
    // It only controls the NProgress bar.
    return null;
};

export default PageLoader;