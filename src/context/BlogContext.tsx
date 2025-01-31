'use client'
import { createContext, useEffect, useRef, useState } from 'react';
import { axiosKonsumeInstance } from '@/http/konsume';
import { retry } from '@/app/helpers/retryapi';
import { toast } from 'react-toastify';
import { useUserContext } from './UserContext';
import { usePathname, useRouter } from 'next/navigation';

const BlogContext = createContext({} as any);
export default BlogContext;

export function BlogContextProvider({ children }: { children: React.ReactNode }) {
    const [activePage, setActivePage] = useState('home');
    const [activeBlog, setActiveBlog] = useState<string>('All');
    const [toggled, setToggled] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const [name, setName] = useState<string | undefined>();
    const [blogs, setBlogs] = useState([]);
    const [tempBlogs, setTempBlogs] = useState(blogs);
    const [showModal, setShowModal] = useState(false);
    const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
    const [tempBookmarks, setTempBookmarks] = useState(bookmarkedBlogs);
    const [loadingBlog, setLoadingBlog] = useState(false)
    const {getProfileID} = useUserContext();
    const pathname = usePathname()

    useEffect(() => {
        console.log('hi');

        const fetchBlogs = async () => {
            console.log('fetching blogs');
            try {
                setLoadingBlog(true);
                const { data } = await axiosKonsumeInstance.get('/api/Blog/GenerateAllBlogs');
                // console.log(data);

                setBlogs(data.content);
                setTempBlogs(data.content)

                if (data.content.length < 2) {
                    console.log('Retrying due to insufficient blog data...');
                    await retry(fetchBlogs);
                } else {
                    console.log('Blogs fetched successfully:', data.content);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('blogs', JSON.stringify(data.content));
                    }
                }
                setLoadingBlog(false)
            } catch (error) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('lastFetchBlogsDate');
                }
                toast.error('Error fetching blogs')
                console.error('Fetch blog Error:', error);
            }
        };

        const checkAndFetchBlogs = async () => {
            if (typeof window !== 'undefined') {
                setLoadingBlog(true)
                const lastFetchDate = localStorage.getItem('lastFetchBlogsDate');
                const today = new Date().toISOString().split('T')[0];

                if (lastFetchDate !== today) {
                    await fetchBlogs();
                    localStorage.setItem('lastFetchBlogsDate', today);
                } else {
                    const cachedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
                    setBlogs(cachedBlogs);
                    setTempBlogs(cachedBlogs)
                    setLoadingBlog(false);
                }
            }

        };
        if (
            pathname === "/dashboard" ||
            pathname === "/" ||
            pathname === "/auth/login"
          ) {
            checkAndFetchBlogs();
          }
    }, [pathname]);

    useEffect(() => {
        const getBookmarks = async () => {
            try {

                const { data } = await axiosKonsumeInstance.get(`/api/Bookmark/${await getProfileID()}`)
                // console.log(data);
                if (data?.value?.$values) {
                    console.log(data?.value?.$values);
                    // Store the array in localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('bookmarks', JSON.stringify(data.value.$values));
                    }
                    setBookmarkedBlogs(data?.value?.$values);
                    setTempBookmarks(data?.value?.$values);
                }
                if (data?.value?.$values <= 0) {

                }
            } catch (error) {
                // console.log(error);
            } finally {
                if (typeof window !== 'undefined') {
                    const cachedBlogs = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                    setBookmarkedBlogs(cachedBlogs);
                    setTempBookmarks(cachedBlogs)
                }
            }
        }
        getBookmarks()
    }, [pathname])

    const contextValue: any = {
        activePage,
        setActivePage,
        toggled,
        setToggled,
        userMessage,
        setUserMessage,
        name,
        tempBlogs,
        blogs,
        setTempBlogs,
        showModal,
        setShowModal,
        bookmarkedBlogs,
        setBookmarkedBlogs,
        tempBookmarks,
        setTempBookmarks,
        activeBlog, setActiveBlog,
        loadingBlog, setLoadingBlog
    };

    return <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>;
}
