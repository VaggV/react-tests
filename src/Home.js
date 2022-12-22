import BlogList from "./BlogList";
import useFetch from "./useFetch";

const Home = () => {
    const { data: blogs, isPending, error } = useFetch('http://localhost:8000/blogs');
    
    return (
        <div className="home">
            {error && <div>{ error }</div>}
            { isPending && <div>Loading...</div>}

            {/* right part after && is only evaluated if blogs is True (not null) */}
            {blogs && <BlogList blogs={blogs} title="All Blogs!"/>}
            
            {/* <BlogList blogs={blogs.filter((blog) => blog.author === 'mario' )} title="Mario's blogs!"></BlogList> */}
        </div>
    );
}
 
export default Home

//      /blogs       GET     Fetch all blogs
//      /blogs/{id}  GET     Fetch a single blog
//      /blogs       POST    Add a new blog
//      /blogs/{id}  DELETE  Delete a blog
// npx json-server --watch data/db.json --port 8000