import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, X } from 'lucide-react';
import logo from '../assets/logo4.png';

export default function Sidebar({
  navigationItems = [],
  isMobileOpen = false,
  onMobileClose,
}) {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    if (item.onClick) {
      item.onClick();
    }

    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    navigate('/');
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen w-67.5 shrink-0
          flex-col justify-between border-r border-[#17203A] bg-[#0A1128]
          shadow-2xl transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-30 lg:w-62.5 lg:translate-x-0 lg:shadow-none
          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Sidebar Top Section */}
        <div className="min-h-0 overflow-y-auto">
          {/* Logo / Brand */}
          <div className="relative flex flex-col items-center px-5 pb-6 pt-7 lg:px-6 lg:pt-8">
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#8B9CB6] transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#111A35] shadow-lg lg:h-20 lg:w-20">
              <img
                src={logo}
                alt="Sanjeevani AI"
                className="h-full w-full object-cover"
              />
            </div>

            <h2 className="text-center text-[17px] font-bold tracking-wide text-white lg:text-[18px]">
              Sanjeevani{' '}
              <span className="text-[#7886F6]">AI</span>
            </h2>
          </div>

          {/* Navigation */}
          <div className="px-3 sm:px-4">
            <nav className="space-y-1">
              {navigationItems.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name || idx}
                    type="button"
                    onClick={() => handleNavigation(item)}
                    className={`
                      group relative flex w-full items-center
                      rounded-xl px-3 py-3.5 text-left text-sm
                      font-medium transition-all duration-200
                      sm:px-4
                      ${
                        item.isActive
                          ? 'bg-[#181C36] text-[#7886F6]'
                          : 'text-[#8B9CB6] hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {item.isActive && (
                      <span className="absolute bottom-2.5 left-0 top-2.5 w-1 rounded-r-md bg-[#7886F6]" />
                    )}

                    <span className="flex min-w-0 flex-1 items-center gap-3.5">
                      <Icon
                        size={18}
                        strokeWidth={item.isActive ? 2.5 : 2}
                        className={`
                          shrink-0
                          ${
                            item.isActive
                              ? 'text-[#7886F6]'
                              : 'text-[#617492] transition-colors group-hover:text-white'
                          }
                        `}
                      />

                      <span className="truncate">
                        {item.name}
                      </span>
                    </span>

                    {item.isActive && (
                      <ChevronRight
                        size={16}
                        className="ml-2 shrink-0 text-[#7886F6] opacity-60"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout */}
        <div className="shrink-0 border-t border-[#17203A] p-3 sm:p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-medium text-[#8B9CB6] transition-colors hover:bg-white/5 hover:text-white sm:px-4"
          >
            <LogOut
              size={18}
              className="shrink-0 text-[#617492] transition-colors group-hover:text-white"
            />

            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}