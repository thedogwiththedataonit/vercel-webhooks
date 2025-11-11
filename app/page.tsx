import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-8 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={24}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-black dark:text-white">
            Vercel Webhooks Example
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            This application demonstrates automated project management using Vercel webhooks. 
            Create projects and see the webhook handlers in action.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 w-full max-w-xl">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔐 Auto-Enable Deployment Protection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically enables SSO protection on all deployments when a project is created.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔍 Git Connection Validator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Checks for Git repository connections and logs alerts when missing for compliance tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium w-full max-w-xl">
          <Link
            className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700 shadow-lg"
            href="/create-project"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Test Project
          </Link>
          <a
            className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 px-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            href="https://vercel.com/docs/observability/webhooks-overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Webhook Documentation
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
          <p>Powered by <span className="font-medium">Vercel SDK</span> and <span className="font-medium">Next.js</span></p>
        </div>
      </main>
    </div>
  );
}
