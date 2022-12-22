import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    // this function runs everytime there's a re-render
    useEffect(() => {

        const abortCont = new AbortController();

        setTimeout(() => {
            fetch(url, { signal: abortCont.signal })
                .then(res => {
                    if (!res.ok){
                        throw Error('Could not fetch the data.');
                    }
                    return res.json();
                })        
                .then(data => {
                    setData(data);
                    setIsPending(false);
                    setError(null);
                })
                .catch(err => {
                    if (err.name === 'AbortError'){
                        console.log('Fetch aborted');
                    } else {
                        setIsPending(false);
                        setError(err.message);
                    }
                });
        }, 1000);

        return () => abortCont.abort();

    }, [url]); 
    // name dependency means that if the name changes and forces a re-render
    // then the useEffect is run
    // [] means that it only runs on the first render

    return { data, isPending, error };
}

export default useFetch;