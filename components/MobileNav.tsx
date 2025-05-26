'use client'

import { useState } from 'react'
import { 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  FileText, 
  Settings,
  LogOut,
  User
} from 'lucide-react'

interface MobileNavProps {
  currentPage: string
  userName?: string
  onLogout: () => void
}

export default function MobileNav({ currentPage, userName, onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: currentPage === 'dashboard' },
    { name: 'Financial', href: '/dashboard/financial', icon: BarChart3, current: currentPage === 'financial' },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText, current: currentPage === 'documents' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, current: currentPage === 'settings' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              {/* User info */}
              {userName && (
                <div className="flex items-center p-3 mb-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">User</p>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        item.current ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      {item.name}
                    </a>
                  )
                })}
              </nav>

              {/* Logout button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    onLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
