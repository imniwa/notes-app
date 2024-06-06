export default function AuthLayout({children}:Readonly<{children:React.ReactNode}>){
    return (
        <main>
            <div className="mt-24 mx-4 md:w-[465px] md:mx-auto">
                {children}
            </div>
        </main>
    )
}