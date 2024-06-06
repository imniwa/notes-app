'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import clsx from "clsx"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"


export default function DashboardNavigation({ username }: { username: string }) {
    const pathname = usePathname().split("/").filter((x) => x !== "")
    return (
        <nav className={clsx([
            "flex place-content-between sticky items-center",
            "p-4 top-0 z-10",
            "bg-white shadow-md mx-4 rounded-b-lg",
        ])}>
            <div className="">
                <Breadcrumb>
                    <BreadcrumbList className="capitalize">
                        {
                            pathname.length > 1 ?
                                pathname.length == 2 ? (
                                    <>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={`/${pathname[0]}`}>{pathname[0]}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink>{pathname[pathname.length - 1]}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                ) : (
                                    <>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={`/${pathname[0]}`}>{pathname[0]}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center gap-1">
                                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    {
                                                        pathname.slice(1, -1).map((path, index) => {
                                                            return (
                                                                <DropdownMenuItem key={index}>
                                                                    <Link className="w-full" href={`/${pathname[0]}/${pathname.slice(1, index + 2).join("/")}`}>
                                                                        {path}
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )
                                                        })
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{pathname[pathname.length - 1]}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                ) : (
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{pathname[0]}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                )
                        }
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus-visible:outline-0">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>{username.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-4">
                    <DropdownMenuLabel>{username}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href={"/dashboard/notes"} className="flex gap-2 w-full">
                            my notes
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={"/dashboard/notes/new"} className="flex gap-2 w-full">
                            new note
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href={"/auth/signout"} className="text-red-500 flex gap-2 w-full">
                            logout
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}