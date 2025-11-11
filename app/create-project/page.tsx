'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    projectId?: string;
    projectUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setResult({
        success: false,
        message: 'Please enter a project name',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName: projectName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || 'Project created successfully!',
          projectId: data.projectId,
          projectUrl: data.projectUrl,
        });
        setProjectName('');
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to create project',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity">
              ← Vercel Webhooks
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Create Test Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a Vercel project without a Git connection to test the webhook handlers.
          </p>
        </div>

        {/* Form */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="projectName"
                className="block text-sm font-medium mb-2"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-awesome-project"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Use lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !projectName.trim()}
              className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Project'
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-4 rounded-md border ${
              result.success
                ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
                : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {result.success ? (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold mb-1">
                    {result.success ? 'Success' : 'Error'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {result.message}
                  </p>
                  {result.projectId && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      <span className="font-medium">Project ID:</span>{' '}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {result.projectId}
                      </code>
                    </div>
                  )}
                  {result.projectUrl && (
                    <a
                      href={result.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                    >
                      View in Vercel Dashboard
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-3">What happens next?</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Creating a project without a Git connection will trigger the <code className="text-xs bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">project.created</code> webhook event.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-medium text-black dark:text-white">Deployment Protection</div>
                  <div className="text-xs">Automatically enables SSO protection on all deployments</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-semibold mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-medium text-black dark:text-white">Git Validation</div>
                  <div className="text-xs">Detects missing Git connection and logs an alert</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            ← Back to Documentation
          </Link>
        </div>
      </main>
    </div>
  );
}

