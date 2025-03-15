import React from 'react'
import SideBar from '@/components/SideBar'
import MobileNavigation from '@/components/MobileNavigation'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
// import { Redirect } from 'next'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");
  return (
    <main className="flex h-screen">
      {/* Side bar Component */}
      <SideBar {...currentUser} />

      {/* Main Section */}
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />

        <div className="main-content">
          {children}
        </div>
      </section>

    </main>
  )
}

export default layout;
