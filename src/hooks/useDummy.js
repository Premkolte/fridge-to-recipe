import { useState, useEffect } from 'react';

export function useDummy(){
    const [query, setQuery]  =  useState('');
    const [recipe, setRecipe] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() =>{
        if(!query.trim()){
            setRecipe([]);
            return ;
        }

        setLoading(true);
        
        fetch(`https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) =>{
            setRecipe(data.recipes || []);
            setLoading(false);  
        })

        .catch((err)=>{
            console.error("serach not found");
            setLoading(false);
        });
        
    } ,[query]);


    return {query, setQuery, recipe, loading };


}