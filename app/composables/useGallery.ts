export const useGallery = async () => {
  const api = useApi()

  return await api('/gallery/')
}