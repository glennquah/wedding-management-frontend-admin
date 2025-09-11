'use client'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
 
export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}