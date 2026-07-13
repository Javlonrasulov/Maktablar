import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { UiPreferencesProvider } from '@/hooks/useUiPreferences'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders() {
  return (
    <ThemeProvider>
      <UiPreferencesProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </UiPreferencesProvider>
    </ThemeProvider>
  )
}
