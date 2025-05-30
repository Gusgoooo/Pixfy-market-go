export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">There was an error during the authentication process. Please try again.</p>
        <a href="/auth/login" className="text-primary hover:underline">
          Return to Login
        </a>
      </div>
    </div>
  )
}
