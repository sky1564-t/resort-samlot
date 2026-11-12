export const useBlogs = async () => {
  const api = useApi()

  return await api('/blogs/')
  
}
