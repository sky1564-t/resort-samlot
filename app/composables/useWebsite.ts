export const useWebsite = async () => {
  const api = useApi()

  return await api('/website/home/')
}