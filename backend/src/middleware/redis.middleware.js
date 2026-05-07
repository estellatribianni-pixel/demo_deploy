import client from "../redis/redis.js";

export const cacheMovies=async (req,res,next)=>{
    
    if (req.method !== "GET") return next();
    
    const key=req.originalUrl;


    try {
        const data = await client.get(key);
        if (data) {
            console.log(`CACHE HIT: ${key}`);
            return res.type('json').send(data);
        }
        console.log(`CACHE MISS: ${key}`);
    } catch (err) {
        console.error("Redis Cache GET Error:", err);
    }

        console.log(`CACHE MISS: ${key}`);
        
        const originalSend = res.json.bind(res);
        
        res.json = (data) => {
            if (res.headersSent) return;
            try{
                if (res.statusCode === 200) {
                client.setEx(key, 3600, JSON.stringify(data)).catch(e => {
                    console.error("Redis SET error:", e);
                })
            }
        }
            catch(e){
                console.error("Redis SET error:", e);
            }
            originalSend(data);
        };
        next()
    }