import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary untuk mencegah crash seluruh aplikasi saat komponen
 * (terutama Canvas/WebGL) melempar error saat render.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role='alert'
          className='flex min-h-screen w-full flex-col items-center justify-center bg-[#121212] p-6 text-center text-white'>
          <h1 className='mb-2 text-3xl font-bold'>Terjadi Kesalahan</h1>
          <p className='mb-6 max-w-md text-base text-gray-300'>
            Maaf, terjadi error saat memuat halaman. Silakan coba muat ulang.
          </p>
          <pre className='mb-6 max-w-md overflow-auto rounded bg-black/40 p-3 text-left text-xs text-red-300'>
            {this.state.error?.message ?? 'Unknown error'}
          </pre>
          <button
            type='button'
            onClick={this.handleReload}
            className='rounded border border-white bg-white px-6 py-2 text-black hover:bg-gray-200'>
            Muat Ulang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
