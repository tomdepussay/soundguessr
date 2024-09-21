import { useState, useEffect } from 'react';

function Height() {
    const [height, setHeight] = useState<number>(window.innerHeight);

    useEffect(() => {
        function handleResize(){
            setHeight(window.innerHeight);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return height;
}

export default Height;